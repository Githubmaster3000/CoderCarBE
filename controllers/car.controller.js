const mongoose = require("mongoose");
const Car = require("../models/Car");
const carController = {};

carController.createCar = async (req, res, next) => {
  const { page } = req.body;
  try {
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    const car = await Car.create({
      // might replace this with .save()
      make,
      model,
      release_date,
      transmission_type,
      size,
      style,
      price,
    });
    // Update the response format
    const response = {
      message: "Create Car Successfully!",
      car: {
        make,
        model,
        release_date,
        transmission_type,
        size,
        style,
        price,
      },
    };
    console.log(response);
    res.json(response); // Send the response as JSON
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

carController.getCars = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // default to 10 items per page if not specified
    const skip = (page - 1) * limit;

    const cars = await Car.find({ isDeleted: false }).skip(skip).limit(limit);

    const totalCarsCount = await Car.countDocuments({ isDeleted: false });

    const response = {
      message: "Get Car List Successfully!",
      cars: cars,
      page: 1,
      total: Math.ceil(totalCarsCount / limit),
    };
    console.log(cars);
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

carController.editCar = async (req, res, next) => {
  try {
    const { make, model, release_date, transmission_type, size, style, price } =
      req.body;
    const id = req.params.id;

    const car = await Car.findByIdAndUpdate(
      id,
      {
        $set: {
          make,
          model,
          release_date,
          transmission_type,
          size,
          style,
          price,
        },
      },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Update the response format
    const response = {
      message: "Update Car Successfully!",
      car: car,
    };

    console.log(response);
    res.json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

carController.deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true }
    );

    const response = {
      message: "Delete Car Successfully!",
      car: car,
    };
    console.log(response);
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

module.exports = carController;
