'use strict'

const Tweet = use('App/Models/Tweet');
const Request = use('Request'); 
const TwitterApi = use('Adonis/Services/Twitter');

class ScheduleTweetController {


    async store({request,response}){
       // console.log('I am working');

        const data  = request.only(['postdatetime','twitterUserId','message']);
        const tweet = await Tweet.create(data);
        return tweet;
    }


    async post({request,response}){
        console.log('I am running');
        let message = 'I an running' ;
        
        // const callback = async (error, requestToken, requestTokenSecret, results) =>{
        //     return response.status(200).json({error, requestToken, requestTokenSecret, results});
        // }
        //  let apiResponse = await TwitterApi.getRequestToken(async (error, requestToken, requestTokenSecret, results) =>{
        //     console.log(error, requestToken, requestTokenSecret);
        //     return {
        //         error, requestToken, requestTokenSecret, results
        //     }
        //     //return response.status(200).json({error, requestToken, requestTokenSecret, results});
        // });
        //TwitterApi.getRequestToken()
        //return response.status(200).json({apiResponse});
        
        // const todos = await Request.get('https://jsonplaceholder.typicode.com/todos');
        // if(todos.length > 0){
        //     return response.status(200).json({todos});
        // }
        let apiResponse = await TwitterApi.getRequestToken();
        response.status(200).json(apiResponse);

    }
}

module.exports = ScheduleTweetController
