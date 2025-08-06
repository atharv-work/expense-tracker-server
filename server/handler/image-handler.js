const dotenv = require("dotenv");
const express = require('express');
const multer = require('multer');
const images = require('../models/Image');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config(); // defaults to .env
}

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const image = new images({
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    const savedImage = await image.save();

    res.status(201).json({
      _id: savedImage._id,
      url: `${process.env.SERVER_URI}/images/${savedImage._id}`,
    });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err.message });
  }
});

router.get('/images', async (req, res) => {
  try {
    const allImages = await images.find({}, '_id');

    const imageList = allImages.map(img => ({
      _id: img._id,
      url: `${process.env.SERVER_URI}/images/${img._id}`,
    }));

    res.json(imageList);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching images', error: err.message });
  }
});

router.get('/images/:id', async (req, res) => {
  try {
    const image = await images.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving image', error: err.message });
  }
});

module.exports = router;
