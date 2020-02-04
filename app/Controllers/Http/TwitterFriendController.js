'use strict'

const Follow = use('App/Models/Follow');
const Unfollow = use('App/Models/Unfollow');
const TwitterApi = use('Adonis/Services/Twitter');
const _ = use('lodash');

//const _ = require('lodash');
class TwitterFriendController {


    async potentialFollower({auth,request,response,params}){
        try{
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds,twitter_id} = request.twitterUser;
            const requestParams = request.only(['twitterHandle']);
            //return response.status(200).json({searchHandle});
            let params;
            if(requestParams.twitterHandle && requestParams.twitterHandle != ''){
                params = {
                    screen_name : requestParams.twitterHandle
                };
            }else{
                const validIds = _.compact(wiseListUserIds);
                if(validIds.length != 0){
                    const randomIdIndex = _.random(validIds.length);
                    const selectedId = validIds[randomIdIndex];
                    params = {
                        user_id : selectedId
                    };
                }else{
                    throw 'No user Id/Handle Found';
                }
            }
            const myParams = {
                user_id : twitter_id
            }
            console.log(params);
            try{
                const  potentialFollowerResponse = await TwitterApi.followers('ids',params,twitter_accessToken,twitter_accessSecret);
                const myfollowingResponse = await TwitterApi.friends('ids',myParams,twitter_accessToken,twitter_accessSecret);
                const myfollowerResponse = await TwitterApi.followers('ids',myParams,twitter_accessToken,twitter_accessSecret);
                if(potentialFollowerResponse && myfollowingResponse && myfollowerResponse && potentialFollowerResponse.parsedData && myfollowingResponse.parsedData && myfollowerResponse.parsedData ){
                    const potentailFollowerUserids = potentialFollowerResponse.parsedData.ids;
                    const myFollowingUserIds = myfollowingResponse.parsedData.ids
                    const myFollowerUserIds = myfollowerResponse.parsedData.ids
                    const notInterstedUserIds = [...myFollowingUserIds,...myFollowerUserIds];
                    try{
                        /* Per Day 100 Only Potentail Unfollower */
                        const potentialFollower = _.chunk(_.difference(potentailFollowerUserids,notInterstedUserIds),100)[0];
                        const params = {
                            user_id : potentialFollower.join(','),
                        }
                        const userLookUpResponse = await TwitterApi.users('lookup',params,twitter_accessToken,twitter_accessSecret);
                        if(userLookUpResponse.parsedData){
                            const user = userLookUpResponse.parsedData;
                            response.status(200).json(user);
                        }else{
                            const error = userLookUpResponse.error;
                            return response.status(500).json({
                                error
                            });
                        }
                    }catch(e){
                        const error = e.error;
                        return response.status(500).json({error});
                    }
                    //response.status(200).json({params,myParams,potentailFollowerUserids,myFollowingUserIds});
                }else{
                    return response.status(400).json({searchHandle});
                }
            }catch(e){
                console.log(e.error);
                const error = e.error;
                response.status(500).json({
                    error
                })
            }
        }catch(error){
            console.log(error);
            return response.status(500).json({
                error
            })
        }
    }

    async potentialUnfollower({auth,request,response,params}){
        try{
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds} = request.twitterUser;
            const params = request.get();
            const followingResponse = await TwitterApi.friends('ids',params,twitter_accessToken,twitter_accessSecret);
            const followerResponse = await TwitterApi.followers('ids',params,twitter_accessToken,twitter_accessSecret);
            if(followingResponse && followerResponse && followingResponse.parsedData && followerResponse.parsedData){
                const followingIds =  followingResponse.parsedData.ids;
                const followerIds =  followerResponse.parsedData.ids;
                const notInterstedUserIds = [...followerIds,...whiteListUserIds];
                try{
                    /* Per Day 100 Only Potentail Unfollower */
                    const potentialUnFollower = _.chunk(_.difference(followingIds,notInterstedUserIds),100)[0];
                    const params = {
                        user_id : potentialUnFollower.join(','),
                    }
                    try{
                        const userLookUpResponse = await TwitterApi.users('lookup',params,twitter_accessToken,twitter_accessSecret);
                        if(userLookUpResponse.parsedData){
                            const user = userLookUpResponse.parsedData;
                            response.status(200).json(user);
                        }else{
                            const error = userLookUpResponse.error;
                            return response.status(500).json({
                                error
                            });
                        }
                    }catch(e){
                        const error = e.error;
                        return response.status(500).json({error});
                    }
                   
                }catch(e){
                    return response.status(400).json({
                        error: '3rd Party API facing Some Issue in user lookup section'
                    })  
                }
                //response.status(200).json({followingIds,followerIds,whiteListIds,potentialUnFollower});
            }else{
                return response.status(400).json({
                    error: '3rd Party API facing Some Issue in Friend section'
                })
            }
        }catch(error){
            console.log(error);
            return response.status(500).json({
                error
            })
        }
    }


    async followNow({request,response}){
        try{
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds,twitter_id} = request.twitterUser;
            const {userId} = request.only(['userId']);
            if(userId){
                try{
                    const params = {
                        user_id : userId,
                    }
                    const friendShipResponse = await TwitterApi.friendships('create',params,twitter_accessToken,twitter_accessSecret);
                    if(friendShipResponse.parsedData){
                        const firendship = friendShipResponse.parsedData;
                        response.status(200).json(firendship);
                    }else{
                        const error = friendShipResponse.error;
                        return response.status(500).json({
                            error
                        });
                    }
                }catch(e){
                    const error = e.error;
                    return response.status(500).json({error});
                }
            }else{
                return response.status(400).json({
                    error : 'No user id found'
                })
            }
        }catch(error){
            console.log(error);
            response.status(500).json({
                error   
            })
        }
    };


    async unfollowNow({request,response}){
        try{
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds,twitter_id} = request.twitterUser;
            const {userId} = request.only(['userId']);
            if(userId){
                try{
                    const params = {
                        user_id : userId,
                    }
                    const friendShipResponse = await TwitterApi.friendships('destroy',params,twitter_accessToken,twitter_accessSecret);
                    if(friendShipResponse.parsedData){
                        const firendship = friendShipResponse.parsedData;
                        response.status(200).json(firendship);
                    }else{
                        const error = friendShipResponse.error;
                        return response.status(500).json({
                            error
                        });
                    }
                }catch(e){
                    const error = e.error;
                    return response.status(500).json({error});
                }
            }else{
                return response.status(400).json({
                    error : 'No user id found'
                })
            }
        }catch(error){
            console.log(error);
            response.status(500).json({
                error   
            })
        }
    };



    /* Follow These User */
    async follow({request,response}){
       	try{
            const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds,twitter_id} = request.twitterUser;
            const {userIds} = request.only(['userIds']);
            if(userIds){
                const requestedTwitterId = twitter_id;
			    const followedUserDbFormate = userIds.split(',').map((targetTwitterId)=>{
				    return {requestedTwitterId , targetTwitterId}
                });
                const followDB  = await Follow.createMany(followedUserDbFormate);
                return response.status(200).json({
                    followDB
                })
            }else{
                return response.status(400).json({
                    error : 'No user ids found'
                })
            }
       	}
       	catch(error){
			console.log(error);
           	response.status(500).json({
            	error
           	})
       	}
    }


    /* Unfollow These User */
    async unfollow({request,response}){
        try{
         const {twitter_accessToken,twitter_accessSecret,wiseListUserIds,whiteListUserIds,twitter_id} = request.twitterUser;
         const {userIds} = request.only(['userIds']);
         if(userIds){
             const requestedTwitterId = twitter_id;
             const followedUserDbFormate = userIds.split(',').map((targetTwitterId)=>{
                 return {requestedTwitterId , targetTwitterId}
             });
             const unfollowDB  = await Unfollow.createMany(followedUserDbFormate);
             return response.status(200).json({
                unfollowDB
             })
         }else{
             return response.status(400).json({
                 error : 'No user ids found'
             })
         }
        }
        catch(error){
         console.log(error);
            response.status(500).json({
             error
            })
        }
    }

}

module.exports = TwitterFriendController
