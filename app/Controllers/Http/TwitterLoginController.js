'use strict'
const TwitterApi = use('Adonis/Services/Twitter');
const Config = use('Config');
const TwitterUser = use('App/Models/TwitterUser');
class TwitterLoginController {

    async login({session,request,response}){
        try{
            let apiResponse = await TwitterApi.getRequestToken();
            console.log('Login APi',apiResponse);
            if(apiResponse.results){
                const oauthToken = apiResponse.oauthToken;
                const oauthSecret = apiResponse.oauthTokenSecret;
                session.put('oauthToken',apiResponse.oauthToken);
                session.put('oauthSecret',apiResponse.oauthTokenSecret);
                const logingUrl = TwitterApi.getAuthUrl(apiResponse.oauthToken, {
                    include_email : true
                });
                console.log('loginUrl',logingUrl);
                response.json({
                    logingUrl,
                    oauthSecret
                })
               // response.status(301).redirect(logingUrl);
            }else{
                respone.json({
                    error : 'API is not working'
                }); 
            }
        }catch(e){
            response.json(({
                error : '3rd Party API is not Working'
            }))
        }
    }

    async callback({session,request,auth,response}){
        console.log('Twitter Callback is executing');
        const {oauth_token,oauth_verifier,oauthSecret} = request.only(['oauth_token','oauth_verifier','oauthSecret']);
        console.log({oauth_token,oauth_verifier,oauthSecret});
        const ss_oauthToken = session.get('oauthToken');
        const ss_oauthSecret = session.get('oauthSecret');
        try{
            const apiResponse = await TwitterApi.getAccessToken(oauth_token,oauthSecret,oauth_verifier);
            console.log(apiResponse);
            if(apiResponse.results){
                const {oauthAccessToken,oauthAccessTokenSecret,results} = apiResponse;
                try{
                    const params = {
                        user_id : results.user_id,
                        include_email : true
                    }
                    const verifiedUser = await TwitterApi.verifyCredentials(oauthAccessToken,oauthAccessTokenSecret,params);
                    if(verifiedUser && verifiedUser.parsedData){
                        return response.status(200).json(verifiedUser.parsedData);
                    }else{
                        return response.status(400).json(verifiedUser);
                    }
                }catch(error){
                    return response.status(500).json({
                        error
                    })
                }               
                

                // console.log('Api Ressponse',apiResponse);
                // const twitterCheckUser = {
                //     twitter_id :apiResponse.results.user_id
                // }
                // const twitterUser = {
                //     twitter_id :apiResponse.results.user_id,
                //     twitter_screenName:apiResponse.results.screen_name,
                //     twitter_accessToken:apiResponse.oauthAccessToken,
                //     twitter_accessSecret:apiResponse.oauthAccessTokenSecret,
                //     user_id : 1
                // }
                // const user = await TwitterUser.findOrCreate(twitterCheckUser,twitterUser);
                // const token = await auth.generate(user,true);
                // Object.assign(user, token)
                // return response.status(200).json(user);


            //return response.status(200).json(apiResponse);
            }else{
            // console.log('Error');
                console.log(apiResponse);
                return response.status(500).json(apiResponse);
            }
        }catch(error){
            return response.status(500).json({error})
        }
    }


    /*  */
    async verifyCredentials({auth,request,response}){
        try{
            console.log('Load Profile');
            const {twitter_accessToken,twitter_accessSecret} = request.twitterUser;
            const params = request.get();
            const userProfile = await TwitterApi.verifyCredentials(twitter_accessToken,twitter_accessSecret,params);
            if(userProfile && userProfile.parsedData){
                return response.status(200).json(userProfile.parsedData);
            }else{
                return response.status(400).json(userProfile);
            }
        }catch(error){
            return response.status(500).json({
                error
            })
        }
    }


    async clear({request,auth,response}){
        const users = await TwitterUser.truncate();
        return response.json({
            message:'Truncated AllData',
            users
        })
    }
}

module.exports = TwitterLoginController
