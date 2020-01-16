'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Helpers = use('Helpers')



Route.group(() => {
  Route.post('users/register', 'UserController.store')
  Route.post('users/login', 'UserController.login')
  Route.get('users/clear', 'UserController.clear')
  // GET /api/v1/users
  //Route.post('users', closure)  // POST /api/v1/users
  Route.get('twitter/clear', 'TwitterLoginController.clear')
  Route.get('twitter/callback','TwitterLoginController.callback')
  Route.get('twitter/login','TwitterLoginController.login')
  Route.get('twitter/potentialFollower','TwitterFriendController.potentialFollower').middleware(['isOwner'])
  Route.get('twitter/potentialUnfollower','TwitterFriendController.potentialUnfollower').middleware(['isOwner'])
  Route.get('twitter/verifyCredentials','TwitterLoginController.verifyCredentials').middleware(['isOwner'])
  Route.post('twitter/users/:type','TwitterLoginController.users').middleware(['isOwner'])


  Route.post('schedule/tweet','ScheduleTweetController.store')
  Route.get('schedule/tweet/post','ScheduleTweetController.post')
}).prefix('api/v1')

// Route.any('*', ({view}) => {
//   //response.wr
//  // response.type('application/html');
//   console.log('-->',Helpers.publicPath('index.html'));
//   return view.render('homepage');
//   //response.sendFile(Helpers.publicPath('dist/twitter/index.html'));
//    //response.download(Helpers.publicPath('index.html'));
//    //return { greeting: 'Hello world in JSON' }
// })

Route.get('*',  ({ view,response }) => {
  response.status(200).json({
    message : 'API Is Running' 
  });
  //response.download(Helpers.publicPath('index.html'))
  //view.view
  //return view.render(Helpers.publicPath('index.html'))
})
