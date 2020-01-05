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

  isValidOwner(twitterUserId){
    return true;
  }

  async handle ({ request,response }, next) {
    // call next to advance the request
    console.log('MiddleWare is working');
    const twitterUserId = '752038095504052224';
    if(this.isValidOwner(twitterUserId)){
      const twitterUser =  await TwitterUser.findBy('twitter_id',twitterUserId);
      if(!twitterUser){
        return response.status(400).json({
          message : 'You need to authorise this account'
        })
      }else{
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
