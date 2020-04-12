'use strict'

const TwitterApi = use('Adonis/Services/Twitter');
const Tweet = use('App/Models/Tweet');
const Request = use('Request'); 
const Helpers = use('Helpers');


class ScheduleTweetController {

    async _uploadMedia(media,token,secret){
        console.log('Upload Media',media); 
        try{
            const params = {
                media
            }
            const mediaUploadResponse = await TwitterApi.uploadMedia(params,token,secret);
            if(mediaUploadResponse.parsedData){
                console.log('Parsed Data',mediaUploadResponse.parsedData);
            }else{
                console.log('Error',mediaUploadResponse.error);
            }
        }catch(e){
            console.log('Error',e);
        }
        return  'Media is uploading' + media;
    }

    async load({request,response}){
        try{
            const tweets = await Tweet.loadTweets();
            return tweets;
        }catch(e){
            return {
                'Status' : 'Loading Tweets'
            }
        }
        
    }   


    async store({request,response}){
     
        const data  = request.only(['postdatetime','twitterUserId','status','multimedia','image']);
        const {twitter_id} = request.twitterUser;
        console.log('Storing the post',data);
        if(data.status && data.postdatetime){
            // console.log('Post time ',data.postdatetime);
            data.postdatetime = new Date(data.postdatetime);
            data.twitter_id = twitter_id;
            if(data.multimedia){
                // Handle multimedia Storage --
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
        const requestData  = request.only(['status','media']);
        try{
            const {twitter_accessToken,twitter_accessSecret} = request.twitterUser;
            if(requestData.status){ 
                const {status,media} = requestData;
                const params = {
                    status
                }
                const mediaFile =  request.file('mediaFile',{
                    types: ['image'],
                    size: '2mb'
                });
                if(media && mediaFile){
                    try{
                        const uplodaParams = {
                            media : mediaFile.tmpPath
                        }
                        const uploadResponse =  await TwitterApi.uploadMedia(uplodaParams,twitter_accessToken,twitter_accessSecret);
                        if(uploadResponse.parsedData){
                            console.log('Medai',uploadResponse.parsedData)
                            params.media_ids = uploadResponse.parsedData.media_id_string;
                        }else{
                            return response.status(400).json({
                                error : 'Getting Issue In uploading Media to Twitter'
                            })   
                        }
                    }catch(e){
                        return response.status(400).json({
                            error : 'Getting Issue In uploading Media to Twitter'
                        })
                    }
                }
                console.log('Twitter STATUS params',params);
                try{
                    const statusResponse = await TwitterApi.statuses('update',params,twitter_accessToken,twitter_accessSecret);
                    if(statusResponse.parsedData){
                        const status = statusResponse.parsedData;
                        return response.status(200).json({
                            status 
                        });
                    }else{
                        return response.status(400).json({
                            error : statusResponse.error
                        });
                    }
                }catch(e){
                    return response.status(500).json(e.error);
                }
            }else{
                return response.status(400).json({
                    error : 'Bad Data Formate'
                })
            }
        }catch(error){
            return response.status(500).json({error});
        }
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
        //const tweets = await Tweet.postTweetsToTwitter();

       // return {tweets};
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
