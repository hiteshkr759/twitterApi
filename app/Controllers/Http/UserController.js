'use strict'
const User = use('App/Models/User');
class UserController {

    async store({request,auth,response}){
        console.log('User is Registering');
        try{
            const data = request.only(['username','email','password']);
            console.log(data);
            if(data.email && data.password && data.username){
                const userExist  = await User.findBy('email',data.email);
                if(userExist){
                    return response
                    .status(400)
                    .send({
                        message : 'User already exist '
                    })
                }            
                const user = await User.create(data);
                const token = await auth.generate(user);
                Object.assign(user, token)
                //console.log('Testing',data,userExist,user);
                //return user;
                return response
                    .status(200)
                    .send(user);
            }else{
                return response.status(400).json({
                    message : 'Missing paramaters username,email,password'
                })
            }
        
        }catch(err){
            return response
            .status(err.status)
            .send(err);
        }
    }


    async login({request,auth,response}){
        let {email, password} = request.all();
        try{
            if (await auth.attempt(email, password)) {
                let user = await User.findBy('email', email)
                let token = await auth.generate(user)
                Object.assign(user, token)
                return response.json(user)
            }
            return response.json({
                message : 'Auth Failing'
            })
        }catch(e){
            console.log(e)
            return response.json({message: 'You are not registered!'})
        }
    }


    async clear({request,auth,response}){
        const users = await User.truncate();
        response.json({
            message:'Truncated AllData',
            users
        })
    }



}

module.exports = UserController
