'use strict'
const TwitterApi = use('Adonis/Services/Twitter');
const Config = use('Config');
const TwitterUser = use('App/Models/TwitterUser');
const User = use('App/Models/User');

class TwitterLoginController {

    async login({session,request,response}){
        try{
            let apiResponse = await TwitterApi.getRequestToken();
            if(apiResponse.results){
                const oauthToken = apiResponse.oauthToken;
                const oauthSecret = apiResponse.oauthTokenSecret;
                session.put('oauthToken',apiResponse.oauthToken);
                session.put('oauthSecret',apiResponse.oauthTokenSecret);
                const logingUrl = TwitterApi.getAuthUrl(apiResponse.oauthToken, {
                    include_email : true
                });
                response.json({
                    logingUrl,
                    oauthSecret
                })
            }else{
                respone.json({
                    error : 'API is not working'
                }); 
            }
        }catch(e){
            response.json({
                error : '3rd Party API is not Working'
            });
        }
    }

    async callback({session,request,auth,response}){
        const {oauth_token,oauth_verifier,oauthSecret} = request.only(['oauth_token','oauth_verifier','oauthSecret']);
        try{
            const apiResponse = await TwitterApi.getAccessToken(oauth_token,oauthSecret,oauth_verifier);
            //check for Api Error
            if(apiResponse.oauthAccessToken && apiResponse.oauthAccessTokenSecret){
                const {oauthAccessToken,oauthAccessTokenSecret,results} = apiResponse;
                const { user_id : logedIn_twitter_userId,screen_name } = results;
                // Create User or Authenticate User
                const api_user_email  = logedIn_twitter_userId + '@twitter.api.user';
                const api_user_password  = logedIn_twitter_userId + 'secretWord';
                let logedInUser;
                if(await User.findBy('email',api_user_email)){
                    logedInUser = await User.findBy('email', api_user_email);
                }else{
                    const newApiUser = {
                        username : logedIn_twitter_userId,
                        email : api_user_email,
                        password : api_user_password,
                        linkedTwitterAccounts : logedIn_twitter_userId
                    }
                    logedInUser = await User.create(newApiUser);
                }
                const twitterCheckUser = {
                    twitter_id : logedIn_twitter_userId
                }
                const twitterUser = {
                    twitter_id :logedIn_twitter_userId,
                    twitter_screenName:screen_name,
                    twitter_accessToken:oauthAccessToken,
                    twitter_accessSecret:oauthAccessTokenSecret,
                    user_id : logedInUser.id
                }
                try{
                    const twitterApiuser = await TwitterUser.findOrCreate(twitterCheckUser,twitterUser);
                    let token = await auth.generate(logedInUser)
                    Object.assign(logedInUser, token);
                    return response.status(200).json(logedInUser);
                }catch(e){
                    return response.status(500).json({error : 'Error in Twitter Account Creation'});
                }
            }else{
                const error = apiResponse.error;
                return response.status(500).json({error});
            }
        }catch(error){
            return response.status(500).json({error})
        }
    }


    /* Dashboard login User */
    async verifyCredentials({auth,request,response}){
        try{
            console.log('Load Profile');
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds} = request.twitterUser;
            const params = request.get();
            const userProfileResponse = await TwitterApi.verifyCredentials(twitter_accessToken,twitter_accessSecret,params);
            if(userProfileResponse && userProfileResponse.parsedData){
                const userDetail = userProfileResponse.parsedData;
                const additionDataFromDB = {
                    additionData  : {
                        wiseListUserIds,
                        whiteListUserIds
                    }
                }
                Object.assign(userDetail,additionDataFromDB);
                return response.status(200).json(userDetail);
            }else{
                return response.status(400).json(userProfileResponse.error);
            }
        }catch(error){
            return response.status(500).json({
                error
            })
        }
    }

    async users({auth,request,response,params}){
        try{
            const requestedParams = request.post();
            const type = params.type;
            const {twitter_accessToken,twitter_accessSecret} = request.twitterUser;
            const users = [{
                userId : 'abc',
                params
            }]
            const allLookupUsersResponse = await TwitterApi.users(type,requestedParams,twitter_accessToken,twitter_accessSecret);
            //console.log(allLookupUsersResponse);
            if(allLookupUsersResponse && allLookupUsersResponse.parsedData){
                const lookupUsers = allLookupUsersResponse.parsedData;
                return response.status(200).json(lookupUsers);
            }else{
                return response.status(400).json(allLookupUsersResponse);
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
