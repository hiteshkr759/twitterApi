'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TweetsSchema extends Schema {
  up () {
    this.create('tweets', (table) => {
      table.increments()
      table.string('twitterUserId', 50).notNullable();
      table.string('message', 255).notNullable();
      table.boolean('is_posted').defaultTo(false)
      table.timestamp('postdatetime', { precision: 6 });
      table.timestamps()
    })
  }
  down () {
    this.drop('tweets')
  }
}

module.exports = TweetsSchema
