const PORT = process.env.PORT || 5000
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');

const app = express()

const newspapers = [
  {
    name: 'DailySmarty',
    address: 'https://www.dailysmarty.com/topics/javascript',
    base: 'https://www.dailysmarty.com'
  },
  {
    name: 'DeveloperTech',
    address: 'https://developer-tech.com/categories/developer-languages/developer-languages-javascript/',
    base: ''
  },
  {
    name: 'BleepingComputer',
    address: 'https://www.bleepingcomputer.com/tag/javascript/',
    base: ''
  },
  {
    name: 'GoogleNews',
    address: 'https://news.google.com/search?q=Javascript&hl=en-US&gl=US&ceid=US%3Aen',
    base: 'https://news.google.com'
  },
  {
    name: 'InfoWorld',
    address: 'https://www.infoworld.com/category/javascript/',
    base: ''
  },
  {
    name: 'ChangeLog',
    address: 'https://changelog.com/topic/javascript',
    base: ''
  },
  {
    name: 'WisdomGeek',
    address: 'https://www.wisdomgeek.com/',
    base: ''
  },
  {
    name: 'Dev',
    address: 'https://dev.to/latest',
    base: ''
  },
  {
    name: 'InfoQ',
    address: 'https://www.infoq.com/javascript/news/',
    base: 'https://infoq.com'
  },
  {
    name: 'TechXplore',
    address: 'https://techxplore.com/software-news/',
    base: ''
  },
]


const articles = []

newspapers.forEach(newspaper => {
  axios.get(newspaper.address)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      $('a:contains("JavaScript")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name
          })
        })
     })
})

app.get('/', (req, res) => {
  res.json('Welcome to My Javascript News API')
})

app.get('/news', (req, res) => {
  res.json(articles);
})


app.get('/news/:newspaperId', (req, res) => {
  const newspaperId = req.params.newspaperId
  const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].base

  axios.get(newspaperAddress)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)

      const specificArticles = []

      $('a:contains("JavaScript")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')

        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId
        })
      })
      res.json(specificArticles)
    })
})




app.listen(PORT, () => console.log(`server running on ${PORT}`))