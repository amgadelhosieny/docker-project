const express = require('express');
    //const mongoose = require('mongoose');
const redis = require('redis');
const os = require('os');
const { Client } = require('pg');

// Init app
const PORT = process.env.PORT || 4000;
const app = express();



// Connect to Redis
const REDIS_PORT = 6379;
const REDIS_HOST = 'redis';  // Assuming Redis container is named 'redis' in Docker Compose

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}:${REDIS_PORT}`,  // Corrected URL syntax with backticks
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis...'));
redisClient.connect();



// Connect to MongoDB
// const DB_USER = 'root';
// const DB_PASSWORD = 'example';
// const DB_PORT = 27017;
// const DB_HOST = 'mongo';  // Assuming MongoDB container is named 'mongo' in Docker Compose

// const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;  // Corrected MongoDB URI with backticks
// mongoose
//   .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch((err) => console.log('Failed to connect to MongoDB:', err));




//for redis cache
// Root endpoint
app.get('/', (req, res) => {
  redisClient.set('products', 'products...');  // Storing data in Redis
  console.log(`Traffic from ${os.hostname()}`);  // Corrected string interpolation
  res.send('<h1>Hello Amgad from AWS</h1>');
});


// Data endpoint
app.get('/data', async (req, res) => {
  try {
    const products = await redisClient.get('products');  // Getting data from Redis
    res.send(`<h1>Hello from AWS</h1><h2>${products}</h2>`);  // Corrected HTML rendering with template literals
  } catch (err) {
    console.error('Error fetching data from Redis:', err);
    res.status(500).send('Error fetching data from Redis');
  }
});


//POSTGRES DB

const DB_USER = 'root';
const DB_PASSWORD = 'example';
const DB_PORT = 5432;
const DB_HOST = 'postgres';  // Assuming postgres container is named 'mongo' in Docker Compose

const URI = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`;  // Corrected postgres URI with backticks
const client = new Client({
  connectionString: URI,
})
client.connect()
  .then(() => console.log('Connected to postgres...'))
  .catch((err) => console.log('Failed to connect to postgres:', err));



// Start the server
app.listen(PORT, () => console.log(`App is up and running on port: ${PORT}`));
