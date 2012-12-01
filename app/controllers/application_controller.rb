class ApplicationController < ActionController::Base
  protect_from_forgery

  def index
  end

  def suggestions
    render :json => RDIO.searchSuggestions(:query => params[:query], :types => 'Track')
  end
end
