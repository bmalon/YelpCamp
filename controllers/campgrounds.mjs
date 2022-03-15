import Campground from '../models/campground.mjs';

const index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

const renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Campground does not exist!');
    return res.redirect('/campgrounds');
  }
  return res.render('campgrounds/edit', { campground });
};

const createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully created a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

const showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('author').populate({
    path: 'reviews',
    populate: {
      path: 'author',
    },
  });
  if (!campground) {
    req.flash('error', 'Campground does not exist!');
    res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground });
};

const updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  req.flash('success', 'Successfully updated the campground!');
  return res.redirect(`/campgrounds/${campground._id}`);
};

const deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted your campground!');
  res.redirect('/campgrounds');
};

export {
  index,
  renderNewForm,
  renderEditForm,
  createCampground,
  showCampground,
  updateCampground,
  deleteCampground,
};
