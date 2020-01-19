const { ServiceProvider } = require('@adonisjs/fold');
const LodashService =  use('App/Service/LodashService');
//const Config = use('Config');
//const { Config } = require ('@adonisjs');

class LodashProvider extends ServiceProvider {
  register () {
    console.log('I am Excecuting');
    this.app.bind('Adonis/Services/Lodash', (app) => {
      return new LodashService();
    })
  }

  boot () {
    this.app.use('Env');
  }
}

module.exports = LodashProvider