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
            tweets.map(tweet =>{
                const {message : status , twitter_accessToken,twitter_accessSecret } = tweet;
                // const postedTweet =  await TwitterApi.statuses("update", {
                //     status
                // },twitter_accessToken,twitter_accessSecret);
                // postedTweets.push(postedTweet);
                let postedTweet = await TwitterApi.statuses("update", {
                        status
                    },twitter_accessToken,twitter_accessSecret);
                    console.log(postedTweet)

            });
            console.log('Posted Tweets',postedTweets);
        }
        return tweets;
    }

}

module.exports = Tweet
