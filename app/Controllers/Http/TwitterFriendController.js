'use strict'

class TwitterFriendController {
    async potentialFollower({auth,request,response,params}){
        response.status(200).json({
            message : 'It working'
        })
    }
}

module.exports = TwitterFriendController
