'use strict'
const TwitterApi = use('Adonis/Services/Twitter');
//const _ = require('lodash');
class TwitterFriendController {
    async potentialFollower({auth,request,response,params}){
        response.status(200).json({
            message : 'It working'
        })
    }


    async potentialUnfollower({auth,request,response,params}){
        try{
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds} = request.twitterUser;
            const params = request.get();
            const followingResponse = await TwitterApi.friends('ids',params,twitter_accessToken,twitter_accessSecret);
            const followerResponse = await TwitterApi.followers('ids',params,twitter_accessToken,twitter_accessSecret);
            if(followingResponse && followerResponse && followingResponse.parsedData && followerResponse.parsedData){
                const newArry =  _.chunk(['a', 'b', 'c', 'd'], 2);
                response.status(200).json({newArry});
            }else{

            }
            // if(followingResponse && followingResponse.parsedData){
            //     response.status(200).json(followingResponse.parsedData); 
            // }else{
            //     response.status(400).json(followingResponse.error);
            // }
            // response.status(200).json({
            //     message : 'API IS RUNNING',

            // })
        }catch(error){
            response.status(500).json({
                error
            })
        }
        
    }
}

module.exports = TwitterFriendController
