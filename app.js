require('dotenv').config()

const SwaggerExpress = require('swagger-express-mw')
const app = require('express')()

const config = {
   appRoot: __dirname, // required config
   port: 10010
}

SwaggerExpress.create(config, (err, swaggerExpress) => {
   if (err) { throw err; }

   // install middleware
   swaggerExpress.register(app)

   if (process.env.NODE_ENV !== 'test') {
      app.listen(config.port);
   }

   if (swaggerExpress.runner.swagger.paths['/hello']) {
      console.log(`try this:\ncurl http://127.0.0.1:${config.port}/hello?name=Scott`);
   }
});

module.exports = app; // for testing
