const moment = require('moment')
const request = require('axios')

let redditPosts = []

let limitDate = moment('31-08-2017', 'DD-MM-YYYY')

request.get('https://www.reddit.com/r/programming.json')
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