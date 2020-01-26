'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowSchema extends Schema {
  up () {
    this.create('follows', (table) => {
      table.string('requestedTwitterId', 80).notNullable()
      table.string('targetTwitterId', 80).notNullable()
      table.string('status', 80).defaultTo('pending')
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('follows')
  }
}

module.exports = FollowSchema
