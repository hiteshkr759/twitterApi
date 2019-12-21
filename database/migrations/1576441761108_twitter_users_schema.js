'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TwitterUsersSchema extends Schema {
  up () {
    this.create('twitter_users', (table) => {
      table.increments()
      table.string('twitter_id', 50).notNullable().unique();
      table.string('twitter_screenName', 50).notNullable();
      table.string('twitter_accessToken', 255).notNullable();
      table.string('twitter_accessSecret', 255).notNullable();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('id').inTable('users');
      table.timestamps()
    })
  }

  down () {
    this.drop('twitter_users')
  }
}

module.exports = TwitterUsersSchema
