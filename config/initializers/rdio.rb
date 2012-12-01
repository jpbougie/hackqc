RDIO = RdioApi.new(:consumer_key => ENV['RDIO_APP_KEY'], :consumer_secret => ENV['RDIO_APP_SECRET'])

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :rdio, ENV['RDIO_APP_KEY'], ENV['RDIO_APP_SECRET']
end
