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

function getPostsFromReddit (outcome, urlParams) {
  let url = config.subredditurl + urlParams

  return request.get(url).then(function (response) {
    let arePostsCreatedBeforeLimitDate = true

    response.data.data.children.map(function (el) {
      let postDate = moment.unix(el.data.created)
      if ( postDate.diff(limitDate, 'days') > 0 ) {
        redditPosts.push(el)
      } else {
        arePostsCreatedBeforeLimitDate = false
      }
    })

    if (arePostsCreatedBeforeLimitDate) {
      getPostsFromReddit(outcome, ('?after=' + response.data.data.after ) )
    } else {
      outcome()
    }
  })
}



let crawl = new Promise(function (resolve, reject) {
  getPostsFromReddit(resolve, '')
})
// After crawling
crawl.then(function (data) {
  let domainsList = getDomainsFromPosts(redditPosts)
  console.log(domainsList)
})
// Error handling
crawl.catch(function (error) {
  console.log('Something happened: ', error)
})