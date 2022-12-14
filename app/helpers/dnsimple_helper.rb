module DnsimpleHelper
  @@client = Dnsimple::Client.new(
      base_url: "https://api.sandbox.dnsimple.com",
      access_token: Rails.application.credentials.dnsimple.token
    )
  def client
    return @@client
  end
end
