class UsersController < ApplicationController
  layout :application
  def create
    @user = User.find_or_create_from_auth_hash(auth_hash)
    self.current_user = @user
    redirect_to '/'
  end

  def edit
    @user = User.find(params[:user_id])
    render :json => @user
  end

  def login
    if request.post?
      user = RDIO.findUser('vanityName' => params[:username])
      if user
        @user = User.find_or_create_by(:username => params[:username], :is_linked => true,
                                       :image_url => "cdn3.rd.io/#{user.baseIcon}", :profile_url => "rd.io/#{user.url}")
      else
        @user = User.find_or_create_by(:username => params[:username])
      end
      session[:current_user] = @user
      #render :json => @user
      redirect_to '/'
    else

    end
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
