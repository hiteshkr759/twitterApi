'use strict'

const Task = use('Task');
const Follow = use('App/Models/Follow');

class FollowScheduler extends Task {
  static get schedule () {
    //return '0 */1 * * * *'
    return '*/1 * * * *';
  }

  async handle () {
    const followSatatus = await Follow.taskFollow();
    console.log('Follow Schedule -->',followSatatus,Date());
    //this.info('Task TweetScheduler handle')
  }
}

module.exports = FollowScheduler
