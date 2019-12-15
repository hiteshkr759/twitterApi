'use strict'
const TwitterApi = use('Adonis/Services/Twitter');
const Config = use('Config');
const TwitterUser = use('App/Models/TwitterUser');
class TwitterLoginController {

    async login({session,request,response}){
        let apiResponse = await TwitterApi.getRequestToken();
        if(apiResponse.results){
            session.put('oauthToken',apiResponse.oauthToken);
            session.put('oauthSecret',apiResponse.oauthSecret);
            const logingUrl = TwitterApi.getAuthUrl(apiResponse.oauthToken, {});
            response.redirect(logingUrl);
        }else{
            respone.json({
                error : 'API is not working'
            }); 
        }  
    }

    async callback({session,request,response}){
        console.log('I am calling to check');
        const {oauth_verifier} = request.only(['oauth_verifier']);
        const oauthToken = session.get('oauthToken');
        const oauthSecret = session.get('oauthSecret');
        const apiResponse = await TwitterApi.getAccessToken(oauthToken,oauthSecret,oauth_verifier);
        if(apiResponse.results){
            const twitterCheckUser = {
                twitter_id :apiResponse.results.user_id
            }
            const twitterUser = {
                twitter_id :apiResponse.results.user_id,
                twitter_screenName:apiResponse.results.screen_name,
                twitter_accessToken:apiResponse.oauthAccessToken,
                twitter_accessSecret:apiResponse.oauthAccessTokenSecret,
                user_id : 1
            }
            const user = await TwitterUser.findOrCreate(twitterCheckUser,twitterUser);
            return response.status(200).json(user);
        }else{
            return response.status(500).json(apiResponse);
        }
    }
}

module.exports = TwitterLoginController
