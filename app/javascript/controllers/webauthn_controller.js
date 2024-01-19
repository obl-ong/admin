import { Controller } from "@hotwired/stimulus"
import * as Auth from "@github/webauthn-json/browser-ponyfill";
import { encode } from 'url-safe-base64'


function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export default class extends Controller {
	
	static values = { options: String, csrf: String }
	static targets = [ "error" ];
	
	connect() {
		console.log("hai")
	  	if (typeof(PublicKeyCredential) == "undefined" && window.location.search != "?force=true") {
			const url = new URL(window.location);
			url.searchParams.append("returnpath", window.location.pathname)
	    	url.pathname = "/auth/unsupported"

			window.location.href = url.href
	  	}

	  	window.Auth = Auth
	}
	
	async createKey() {
		const options = Auth.parseCreationOptionsFromJSON({ publicKey: JSON.parse(this.optionsValue)});
		const response = await Auth.create(options);		
		return response;
	}
	
	async create() {
		try {
			const key = await this.createKey()
			let obj = key.toJSON();
			obj.name = prompt("What would you like to name your passkey?");
			const req = await fetch("/auth/add_key", {
				method: "PATCH",
				body: JSON.stringify(obj), 
  				credentials: 'include',
				headers: {
					"X-CSRF-Token": this.csrfValue,
					"Content-Type": "application/json",
      				"Accept": "application/json"
				}
			})
			const res = await req.json()
			
			if(res.error) {
				throw new Error(res.message);
			}
			
			if(new URLSearchParams(window.location.search).get("from_settings") == 'true') {
				window.location.pathname = "/settings"
			} else {
				window.location.pathname = "/"
			}
		} catch(e) {
			console.error(e);
		}
		
		
	}
	
	async askForKey() {
		const options = Auth.parseRequestOptionsFromJSON({ publicKey: {...JSON.parse(this.optionsValue), userVerification: "preferred"}});
		const response = await Auth.get(options);
		return response.toJSON();
	}
	
	async askAndLogin() {
		try {
			this.errorTarget.textContent = null;
			const key = await this.askForKey()
			const req = await fetch("/auth/verify_key", {
				method: "POST",
  			credentials: 'include',
				body: JSON.stringify(key),
				headers: {
					"X-CSRF-Token": this.csrfValue,
					"Content-Type": "application/json",
      		"Accept": "application/json"
				}
			})
			const res = await req.json()
			console.log(res);
			if(res.error) {
				throw new Error(res.message)
			}
			
			window.location.pathname = "/"
		}
		catch(e) {
			console.error(e);
			console.log("caught!")
			if(e.toString().startsWith("NotAllowedError")) {
				e = new Error("Looks like you clicked cancel or was not allowed by your browser")
			}
			this.errorTarget.textContent = e.toString();
		}
		
	}
}
