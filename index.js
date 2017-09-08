const moment = require('moment')
const request = require('axios')

const config = require('./config.json')

let redditPosts = []
let limitDate = moment(config.limitDate, 'DD-MM-YYYY')

request.get(config.subredditurl)
.then(function (response) {
  response.data.data.children.map(function (el) {
    let postDate = moment.unix(el.data.created)
    if ( postDate.diff(limitDate, 'days') > 0 ) {
      redditPosts.push(el)
    }
  })

  console.log(redditPosts.length)
})
.catch(function (error) {
  console.log(error)
})