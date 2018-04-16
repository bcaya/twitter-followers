class Api::FollowersController < ApplicationController
  before_action :client 

  def index
    followers = @client.followers.take(10).collect do |follower|
      {
        id: follower.id, 
        name: follower.name, 
        img: follower.profile_image_url.to_s
      }
    end 

    render json: followers 
  end

  private 
    def client 
      @client = Twitter::REST::Client.new do |c| 
        c.consumer_key = ENV['CONSUMER_KEY']
        c.consumer_secret = ENV['CONSUMER_SECRET']
        c.access_token = ENV['ACCESS_TOKEN']
        c.access_token_secret = ENV['ACCESS_TOKEN_SECRET']
    end
    end  
end
