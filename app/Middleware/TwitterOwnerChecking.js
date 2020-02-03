'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const TwitterUser = use('App/Models/TwitterUser');


class TwitterOwnerChecking {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */

  isValidOwner(twitterUserId,logeInUser){
    const allLinkedTwitterID  = logeInUser.linkedTwitterAccounts.split(',');
    return allLinkedTwitterID.includes(twitterUserId);
    //console.log('Check for User',twitterUserId,logeInUser.linkedTwitterAccounts);
    //return true;
  }

  async handle ({ request,response,auth }, next) {
    const currentLogedInTwitterUserId = request.header('currentLogedInTwitterUserId','');
    const logeInUser = await auth.getUser();
    if(this.isValidOwner(currentLogedInTwitterUserId,logeInUser)){
      const twitterUser =  await TwitterUser.findBy('twitter_id',currentLogedInTwitterUserId);
      if(!twitterUser){
        return response.status(400).json({
          message : 'You need to authorise this account'
        })
      }else{
        let additionData 
        try{
          additionData = {
            wiseListUserIds : twitterUser.wiseListUserIds.split(',').map( id => parseInt(id)),
            whiteListUserIds : twitterUser.whiteListUserIds.split(',').map( id => parseInt(id))
          }
        }
        catch(e){
          additionData = {
            wiseListUserIds : [],
            whiteListUserIds : []
          }
        }
        Object.assign(twitterUser,additionData);
        request.twitterUser = twitterUser;
      }
    }else{
      return response.status(400).json({
        message : 'This account doesn\'t belong to you'
      })
    }
    await next()
  }
}

module.exports = TwitterOwnerChecking
