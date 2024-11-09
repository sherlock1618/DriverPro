// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
require("dotenv").config();

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for your project',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/api/auth`, // Change this to your API base URL
            },
        ],
    },
    apis: ['./routers/*.js'], // Path to the files with Swagger annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
