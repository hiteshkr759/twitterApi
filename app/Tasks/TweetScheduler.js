'use strict'

const Task = use('Task')

class TweetScheduler extends Task {
  static get schedule () {
    //return '0 */1 * * * *'
    return '*/1 * * * *';
  }

  async handle () {
    console.log('Taskxhecking',Date());
    //this.info('Task TweetScheduler handle')
  }
}

module.exports = TweetScheduler
