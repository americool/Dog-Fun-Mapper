Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  resources :locations do
    get :show_comments
  end
  resources :comments
  resources :users

  match 'users/get_user' => 'users#get_user', :via => :post
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
