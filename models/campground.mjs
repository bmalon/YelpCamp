import mongoose from 'mongoose';

const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

const Campground = mongoose.model('Campground', CampgroundSchema);

export default Campground;
