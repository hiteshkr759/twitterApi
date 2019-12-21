'use strict'
//const Config = use('Config')
let twitterAPI = require('node-twitter-api');

class TwitterService {
    
    constructor(config){
        let instance  = new twitterAPI(config);
        return instance;
    }

    // getInstance(){
    //     return this.instance;
    // }
}

module.exports = TwitterService;