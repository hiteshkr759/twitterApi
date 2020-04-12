'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require("moment");
const Database = use('Database');
const TwitterApi = use('Adonis/Services/Twitter');

class Tweet extends Model {

    static slotStartTime(){
        return moment().seconds(0).milliseconds(0).utc().format("YYYY-MM-DD HH:mm:ss");
    }

    static slotEndTime(){
        //return moment().seconds(0).milliseconds(0).add(5,"minutes").format("YYYY-MM-DD HH:mm:ss");
        return moment().seconds(0).milliseconds(0).utc().add(5,"days").format("YYYY-MM-DD HH:mm:ss");
    }

    static async postTweetsToTwitter(){
        var slotStartTime = Tweet.slotStartTime();
        var slotEndTime = Tweet.slotEndTime();
        const tweets = await Database.select('*')
            .from('tweets')
            .where('postdatetime', '>=', slotStartTime)
            .andWhere('postdatetime','<=',slotEndTime)
            .leftJoin('twitter_users', 'tweets.twitterUserId', 'twitter_users.twitter_id')
            .orderBy('postdatetime','asc');
        if(tweets.length > 0){
            const postedTweets = [];
            //console.log(tweets);
           // const tweet = tweets[0];
           Promise.all(tweets.map(async tweet =>{
                console.log(tweet);
                const {message : status , twitter_accessToken,twitter_accessSecret,multimedia,multiMediaUrl : media } = tweet;
                if(multimedia == 'true'){
                    const apiParams = {
                        status,
                        media
                    }
                    try{
                        const response = await TwitterApi.uploadMediaV2(apiParams,twitter_accessToken,twitter_accessSecret);
                        console.log(response);
                    }catch(e){
                        console.log('Error',e);
                    }
                }else{
                    console.log('Normal Message');
                }
           }));
            console.log('Posted Tweets',postedTweets);
        }
        return tweets;
    }

    static async loadTweets(){
        try{
            const tweets = await Database.select('*')
            .from('tweets');
            return tweets;
        }catch(e){
            return [];
        }
    }

}

module.exports = Tweet
