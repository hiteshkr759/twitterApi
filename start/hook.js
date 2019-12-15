'use strict'

const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
 // addPackages()
 // Not addiing any hook;
})

const addPackages = function() {
    var twitterAPI = require('node-twitter-api');
    //const View = use('View')
    //View.global('myAmazingPackage', myAmazingPackage)
}