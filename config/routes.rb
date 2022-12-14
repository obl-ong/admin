Rails.application.routes.draw do
  post '/domains/new', to: "domains#new"
  get '/domains/:id', to: "domains#dns"
  get '/domains/', to: redirect("/")
  get '/domains/:id/dns', to: redirect("/domains/%{id}")
  get '/domains/:id/email', to: "domains#email"
  get '/domains/:id/links', to: "domains#links"
  get '/domains/:id/settings', to: "domains#settings"
  get '/domains/:id/destroy', to: "domains#destroy"
  post '/domains/:id/addRecord', to: "domains#add_record"
  post '/domains/:id/destroyRecord', to: "domains#destroy_record"
  get 'users/auth'
  get 'users/login'
  get 'users/logout'
  get 'users/new'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
   root "domains#index"
end
