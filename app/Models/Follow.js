'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const moment = require("moment");
const Database = use('Database');
const TwitterApi = use('Adonis/Services/Twitter');

class Follow extends Model {

    static perviousDayTime(){
        return moment().seconds(0).milliseconds(0).utc().add(-1,"days").format("YYYY-MM-DD HH:mm:ss");
    }

    static async taskFollow(){

        const previousDay = Follow.perviousDayTime();


        const follows = await Database.select('twitter_users.twitter_accessToken','twitter_users.twitter_accessSecret','follows.targetTwitterId','follows.id')
            .from('follows')
            .where('status', '=', 'pending')
            //.andWhere('created_at','<=',previousDay)
            .leftJoin('twitter_users', 'follows.requestedTwitterId', 'twitter_users.twitter_id')
            .orderBy('targetTwitterId','asc');
        const followsStatus = [];
        if(follows.length > 0){
            return Promise.all(
                follows.map(async (follow) => {
                    //console.log('follow',follow);
                    let status;
                    const {twitter_accessToken,twitter_accessSecret,targetTwitterId,id} = follow;
                    try{
                        const params = {
                            user_id : targetTwitterId,
                        }
                        console.log('API',twitter_accessToken,twitter_accessSecret,targetTwitterId,id);
                        const friendShipResponse = await TwitterApi.friendships('create',params,twitter_accessToken,twitter_accessSecret);
                        if(friendShipResponse.parsedData){
                            const firendship = friendShipResponse.parsedData;
                            status = 'close';
                            
                            //response.status(200).json(firendship);
                        }else{
                            const error = friendShipResponse.error;
                            status = 'error';
                            console.log('Error',error.data);
                            // return response.status(500).json({
                            //     error
                            // });
                        }
                    }
                    catch(error){
                        console.log('Exception Error',error.data);
                        status = 'error';
                    }
                    console.log('STatus is',status,id);
                    const updateRow = await Database
                    .table('follows')
                    .where('id',id)
                    .update('status', status);
                                    // await follow.save();
                })
            );
        }
        return follows;
        console.log('follows',follows);
        //return 'follow Function';
    }

}

module.exports = Follow
