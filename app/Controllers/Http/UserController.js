'use strict'

class UserController {

    async index(){
        return {
            greeting: 'UserController' 
        }
    }
}

module.exports = UserController
