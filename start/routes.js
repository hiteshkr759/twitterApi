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

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.post('users', 'UserController.store')   // GET /api/v1/users
  //Route.post('users', closure)  // POST /api/v1/users
  Route.get('twitter/callback','TwitterLoginController.callback')
  Route.get('twitter/login','TwitterLoginController.login')
  Route.post('schedule/tweet','ScheduleTweetController.store')
  Route.get('schedule/tweet/post','ScheduleTweetController.post')
}).prefix('api/v1')
