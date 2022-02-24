import express from 'express';
import mongoose from 'mongoose';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import CampgroundModel from './models/campground.mjs';

const filename = fileURLToPath(import.meta.url);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // NOTE: useNewUrlParser, useUnifiedTopology, and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if they are true.
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', join(dirname(filename), 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await CampgroundModel.find({});
  res.render('campgrounds/index', { campgrounds });
});

app.get('/makecampground', async (req, res) => {
  const camp = new CampgroundModel({
    title: 'My Camp',
    description: 'Amazing camping',
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
