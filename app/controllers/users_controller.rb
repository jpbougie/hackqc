class UsersController < ApplicationController
  def create
    @user = User.find_or_create_from_auth_hash(auth_hash)
    self.current_user = @user
    redirect_to '/'
  end

  def login
    user = RDIO.findUser('vanityName' => params[:username])
    if user
      @user = User.find_or_create_by(:username => params[:username], :is_linked => true,
                                     :image_url => "cdn3.rd.io/#{user.baseIcon}", :profile_url => user.url)
    else
      @user = User.find_or_create_by(:username => params[:username])
    end
    render :json => @user
  end

  def vote
    @user.find(params[:user_id])
    @user.jukes += params[:vote]
  end

  protected

  def auth_hash
    request.env['omniauth.auth']
  end
end
