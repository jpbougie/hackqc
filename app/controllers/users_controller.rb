class UsersController < ApplicationController
  layout "application"
  def create
    @user = User.find_or_create_from_auth_hash(auth_hash)
    self.current_user = @user
    redirect_to '/'
  end

  def show
    @user = User.find(params[:user_id])
    render :json => @user
  end

  def login
    if request.post?
      user = RDIO.findUser('vanityName' => params[:username])
      if user
        @user = User.find_or_create_by(:username => params[:username], :is_linked => true,
                                       :image_url => "cdn3.rd.io/#{user.baseIcon}", :profile_url => "rd.io#{user.url}")
      else
        @user = User.find_or_create_by(:username => params[:username])
      end
      session[:current_user] = @user
      #render :json => @user
      redirect_to '/'
    else

    end
  end

  def logout
    session[:current_user] = nil
    redirect_to '/login'
  end

  def vote
    @user = User.find(params[:user_id])
    @user.jukes += params[:vote].to_i
    @user.save
    REDIS.publish 'jukevox', {:user_id => @user.id, :jukes => @user.jukes, :type => 'jukes_update'}.to_json
    render :json => @user
  end

  protected

  def auth_hash
    request.env['omniauth.auth']
  end
end
