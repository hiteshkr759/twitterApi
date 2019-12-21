'use strict'

const Tweet = use('App/Models/Tweet');
const Request = use('Request'); 
const Helpers = use('Helpers');


class ScheduleTweetController {
    
    async store({request,response}){
        const data  = request.only(['postdatetime','twitterUserId','message','multimedia','image']);
        if(data.message && data.postdatetime){
            // console.log('Post time ',data.postdatetime);
            if(data.multimedia){
                const media = request.file('image',{
                    types: ['image'],
                    subtype : ['jpeg','gif'],
                    size: '5mb'
                });
                await media.move(Helpers.tmpPath('uploads/'+data.twitterUserId),{
                    name: `${new Date().getTime()}.${media.subtype}`,
                    overwrite: true
                });
                if(media.moved()){
                    data.multiMediaUrl = `${media._location}\\${media.fileName}`;                
                }else{
                    return {
                        error :  media.error()
                    }
                }
            }else{
                // Storing the date base;
                data.multimedia = 'false';
            }
            const tweet = await Tweet.create(data);
            return tweet;
        }else{
            return {
                error : 'Bad Data Formate'
            }
        }
        
    }


    async post({request,response}){
        console.log('I am running');
        //const tweets = await Database.table('tweets').select('*');
        // var slotStartTime = Tweet.slotStartTime();
        // var slotEndTime = Tweet.slotEndTime();
        // const tweets = await Database.select('*')
        //     .from('tweets')
        //     .where('postdatetime', '>=', slotStartTime)
        //     .andWhere('postdatetime','<=',slotEndTime)
        //     .leftJoin('twitter_users', 'tweets.twitterUserId', 'twitter_users.twitter_id')
        //     .orderBy('postdatetime','asc');
        // if(tweets.length > 0){
            
        // }
        // return tweets;
        const tweets = await Tweet.postTweetsToTwitter();
        return {tweets};
        //date.setSeconds(0,0);
        //endDate.setSeconds(0,0);
       // endDate.add(2,'minutes');
       //super.endDate.concat(['dob']);
      // var endDateMoment = super.dates.concat(['birthday']);
      
        //return {slotStartTime,slotEndTime,tweets};
        // SELECT * FROM tweets LEFT JOIN twitter_users ON tweets.twitterUserId = twitter_users.twitter_id
        //let message = 'I an running' ;
        
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
        //let apiResponse = await TwitterApi.getRequestToken();
        //response.status(200).json(apiResponse);

    }
}

module.exports = ScheduleTweetController
