class User
  include Mongoid::Document

  field :username
  field :access_token
  field :image_url
  field :jukes, :default => 0
  field :is_linked, :default => false
  field :profile_url

end
