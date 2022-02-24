import mongoose from 'mongoose';

const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

const CampgroundModel = mongoose.model('Campground', CampgroundSchema);

export default CampgroundModel;
