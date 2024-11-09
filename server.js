const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");

require("dotenv").config();
const PORT = process.env.PORT || 8000;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

const server = http.createServer(app);

async function MongoDBConnect(){
    try{
        await mongoose.connect(process.env.MONGODB_STRING, clientOptions);
        console.log("mongodb connected");
    }
    catch(err){
        console.error("mongodb connection failed!");
        console.log(err);
        process.exit(1);
    }
}

async function startServer(){
    await MongoDBConnect();
    
    server.listen(PORT, () => {
        console.log(`listening to PORT ${PORT}`);
        console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
}

startServer();
