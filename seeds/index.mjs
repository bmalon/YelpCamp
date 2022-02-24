import mongoose from 'mongoose';
import CampgroundModel from '../models/campground.mjs';
import cities from './cities.mjs';
import { descriptors, places } from './seedHelpers.mjs';

mongoose.connect('mongodb://localhost:27017/yelp-camp', {});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await CampgroundModel.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const randomThousand = Math.floor(Math.random() * 1000);
    const camp = new CampgroundModel({
      location: `${cities[randomThousand].city}, ${cities[randomThousand].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
});