import mongoose from 'mongoose';
import Review from './review.mjs';

const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  location: String,
  images: [
    {
      path: String,
      filename: String,
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

// Mongoose middleware
CampgroundSchema.post('findOneAndDelete', async (doc) => {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

export default Campground;
