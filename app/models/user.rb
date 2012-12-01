class User
  include Mongoid::Document

  field :name
  field :access_token
  field :image_url

end
