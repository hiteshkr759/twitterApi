'use strict'
const TwitterApi = use('Adonis/Services/Twitter');
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
        const {oauth_verifier} = request.only(['oauth_verifier']);
        const oauthToken = session.get('oauthToken');
        const oauthSecret = session.get('oauthSecret');
        const apiResponse = TwitterApi.getAccessToken(oauthToken,oauthSecret,oauth_verifier,(error, accessToken, accessTokenSecret, results)=> {
            if (error) {
                console.log(error);
            } else {
                console.log(accessToken,accessTokenSecret,results);
            }
        });
        return response.status(200).json({
            api : 'It working finre',
            oauth_verifier,
        })
    }
}

module.exports = TwitterLoginController
