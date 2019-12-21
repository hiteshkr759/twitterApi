'use strict'

let twitterAPI = require('node-twitter-api');

class TwitterService {
    
    constructor(){
        console.log('Runnig from Twitter service');
        let instance  = new twitterAPI({
            consumerKey: 'Qgui7W8krz7ccCrpLeolyObz9',
            consumerSecret: 'UGVbI3PZm55rTJKAyTd5ubtGj38S7TmHKqUNytN3eNOiFKeXkC',
            callback: 'http://127.0.0.1:8080/pages/callback'
        });
        return instance;
    }

    // getInstance(){
    //     return this.instance;
    // }
}

module.exports = TwitterService;