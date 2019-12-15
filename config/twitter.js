'use strict'

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use('Env')

module.exports = {
    consumerKey  :  Env.get('CONSUMER_KEY'),
    consumerSecret  : Env.get('CONSUMER_SECRET'),
    callback:Env.get('CALLBACK')
}