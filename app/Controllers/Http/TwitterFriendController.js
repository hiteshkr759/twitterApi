'use strict'
const TwitterApi = use('Adonis/Services/Twitter');
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
            // //const followingResponse = await TwitterApi.friends('ids',twitter_accessToken,twitter_accessSecret);
            // if(followingResponse && followingResponse.parsedData){
            //     response.status(200).json(followingResponse.parsedData);
            // }else{
            //     response.status(400).json(followingResponse.error);
            // }
        }catch(error){
            response.status(500).json({
                error
            })
        }
        
    }
}

module.exports = TwitterFriendController
