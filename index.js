const moment = require('moment')
const request = require('axios')
const _ = require('lodash')

const config = require('./config.json')

let redditPosts = []
let limitDate = moment(config.limitDate, 'DD-MM-YYYY')


function getDomainsFromPosts (posts) {
  let domains = []

  posts.map(function (post) {
    if (!_.find(domains, function (n) { return n === post.data.domain })) {
      domains.push(post.data.domain)
    }
  })

  return domains
}

request.get(config.subredditurl)
.then(function (response) {
  response.data.data.children.map(function (el) {
    let postDate = moment.unix(el.data.created)
    if ( postDate.diff(limitDate, 'days') > 0 ) {
      redditPosts.push(el)
    }
  })

  let domainsList = getDomainsFromPosts(redditPosts)
  console.log(domainsList)
})
.catch(function (error) {
  console.log(error)
})