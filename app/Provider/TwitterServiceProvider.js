const { ServiceProvider } = require('@adonisjs/fold');
const TwitterService =  use('App/Service/TwitterService');
//const Config = use('Config');
//const { Config } = require ('@adonisjs');

class TwitterProvider extends ServiceProvider {
  register () {
    //console.log("Registering the Twitter Provider");
    // Register our ServiceProvider on the namespace: Adonis/Services/Firebase
    // Obtain application reference: app
    this.app.bind('Adonis/Services/Twitter', (app) => {
      // Obtain application configuration in config/
      //const Config = app.use('Adonis/Src/Config')
     // console.log('Insidethe binding function');
      // Export our servic
     
      // console.log(Config.get('twitter'));
      //console.log('Callback',Config.get('twitter.consumerKey'));
      const Config = app.use('Adonis/Src/Config');
      return new TwitterService(Config.get('twitter'));
    })
  }

  boot () {
    this.app.use('Env');
  }


}

module.exports = TwitterProvider