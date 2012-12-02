class User
  include Mongoid::Document

  field :username
  field :access_token
  field :image_url, :default => 'cdn3.rd.io/user/no-user-image-square.jpg'
  field :jukes, :default => 0
  field :is_linked, :default => false
  field :profile_url
  field :follow_url

  def as_json(*args)
    super.tap { |hash| hash["token"] = hash.delete "_id" }
  end

end
