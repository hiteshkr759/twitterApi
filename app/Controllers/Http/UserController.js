'use strict'
const User = use('App/Models/User');
class UserController {

    async store({request,response}){
        
        try{
            const data = request.only(['username','email','password']);
            
            const userExist  = await User.findBy('email',data.email);
            if(userExist){
                return response
                .status(400)
                .send({
                    message : {
                        error : 'User already exist '
                    }
                })
            }            
            const user = await User.create(data);
            //console.log('Testing',data,userExist,user);
            //return user;
             return response
                 .status(200)
                 .send(user);
            
        }catch(err){
            return response
            .status(err.status)
            .send(err);
        }
    }
}

module.exports = UserController
