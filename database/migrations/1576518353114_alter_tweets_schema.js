'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AlterTweetsSchema extends Schema {
  up () {
    this.raw("ALTER TABLE tweets ADD CONSTRAINT FK_TWITTER_USERS_TWITTER_ID FOREIGN KEY (twitterUserId) REFERENCES twitter_users(twitter_id)");
    // this.table('alter_tweets', (table) => {
    //   // alter table
    // })
  }

  down () {
    this.table('alter_tweets', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AlterTweetsSchema
