const request = require('superagent')

const { API_URL, API_KEY } = process.env

const defs = (req, res) => {
   const srcWord = req.swagger.params.word.value
   request.get(`${API_URL}/word.json/${srcWord}/definitions`)
      .query({
         api_key: API_KEY,
         includeRelated: true,
         sourceDictionaries: 'all',
         useCanonical: true,
         limit: 200
      })
      .timeout({
         response: 5000,
         deadline: 60000
      })
      .then(($res) => {
         if ($res.body.length === 0) {
            res.statusCode = 404
         }
         res.json($res.body)
      })
      .catch((err) => {
         console.log('error', err)
         return res.status(err.timeout ? 408 : 500).json(err)
      })
}

module.exports = {
   defs
}
