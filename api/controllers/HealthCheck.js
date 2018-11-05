const request = require('superagent')

const { API_URL, API_KEY } = process.env

const pingWordnik = () => request
   .get(`${API_URL}/words.json/randomWord`)
   .timeout({
      response: 5000,
      deadline: 60000
   })
   .query({
      api_key: API_KEY
   })

const check = (req, res) => pingWordnik()
   .then(({ body }) => res.json(body))
   .catch((err) => {
      res.status(err.timeout ? 408 : 500).json(err)
   })

module.exports = {
   check
}
