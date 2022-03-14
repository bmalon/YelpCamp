import mongoose from 'mongoose';
import nodeFetch from 'node-fetch';
import { createApi } from 'unsplash-js';
import CampgroundModel from '../models/campground.mjs';
import cities from './cities.mjs';
import { descriptors, places } from './seedHelpers.mjs';

// Database config
const dbHost = 'localhost';
const dbPort = 27017;
const dbName = 'yelp-camp';

// Connect to the database
mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {});
mongoose.connection.on('error', console.error.bind(console, 'Database connection error:'));
mongoose.connection.once('open', () => console.log(`Database ${dbName}: connection opened on mongodb://${dbHost}:${dbPort}`));
const db = mongoose.connection;

// Instantiate Unsplash API object
const unsplashAPI = createApi({
  accessKey: 'chmmHOBo8rf24z2cGpZUa_Ix8F_ICa26AOz6e1GoFJA',
  fetch: nodeFetch,
});

// NOTE: FUNCTION DECLARATIONS
// FUNCTION:  Generate 30 random images from the 'In the woods' collection on Unsplash
const generateRandomImages = async () => {
  console.log('Generating 30 random images from Unsplash...');
  const response = await unsplashAPI.photos.getRandom({
    collectionIds: [483251],
    count: 30,
  }).then((result) => {
    if (result.errors) console.log('Unsplash API error: ', result.errors[0]);
    else console.log(`Unsplash API success: ${result.response.length} random images retrieved`);
    return result.response;
  });
  return response;
};

//  FUNCTION:  Generate a random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

//  FUNCTION:  Populate the database with random campgrounds using the seeds
const seedDB = async (unsplashResponse) => {
  await CampgroundModel.deleteMany({});
  const campgrounds = db.collection('campgrounds');
  const camps = [];
  for (let i = 0; i < unsplashResponse.length; i++) {
    const randomThousand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    camps.push(new CampgroundModel({
      author: '622f0054061c1cbd7bc9aabb',
      location: `${cities[randomThousand].city}, ${cities[randomThousand].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `${unsplashResponse[i].urls.regular}`,
      description: 'This is a test description',
      price,
    }));
    // eslint-disable-next-line no-await-in-loop
    // await camp.save();
  }
  await campgrounds.insertMany(camps);
};

// NOTE: PROGRAM EXECUTION
generateRandomImages().then((response) => seedDB(response)).then(() => {
  db.close();
  console.log(`Database ${dbName}: connection closed`);
});
