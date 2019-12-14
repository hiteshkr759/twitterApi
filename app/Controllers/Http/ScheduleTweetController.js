'use strict'

const Tweet = use('App/Models/Tweet');

class ScheduleTweetController {
    async store({request,response}){
       // console.log('I am working');

        const data  = request.only(['postdatetime','twitterUserId','message']);
        const tweet = await Tweet.create(data);
        return tweet;
    }
}

module.exports = ScheduleTweetController
