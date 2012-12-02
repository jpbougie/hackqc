class ApplicationController < ActionController::Base
  protect_from_forgery

  def index
    redirect_to '/login' unless session[:current_user]
  end

  def suggestions
    render :json => RDIO.searchSuggestions(:query => params[:query], :types => 'Track')
  end

  def album
    render :json => RDIO.get(:keys => params["key"])[params['key']]['albumArtistKey']
  end
end
