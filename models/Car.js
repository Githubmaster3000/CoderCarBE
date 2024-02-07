const mongoose = require("mongoose");
const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    release_date: {
      type: Number,
      min: 1900,
      required: true,
    },
    transmission_type: {
      type: String,
      enum: [
        "MANUAL",
        "AUTOMATIC",
        "AUTOMATED_MANUAL",
        "DIRECT_DRIVE",
        "UNKNOWN",
      ],
      required: true,
    },
    size: {
      type: String,
      enum: ["Compact", "Midsize", "Large"],
      required: true,
    },
    style: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

// carSchema.pre(/^find/, function (next) {
// 	if (!('_conditions' in this)) return next();
// 	if (!('isDeleted' in carSchema.paths)) {
// 		delete this['_conditions']['all'];
// 		return next();
// 	}
// 	if (!('all' in this['_conditions'])) {
// 		//@ts-ignore
// 		this['_conditions'].isDeleted = false;
// 	} else {
// 		delete this['_conditions']['all'];
// 	}
// 	next();
// });

carSchema.pre(/^find/, function (next) {
  // Check if 'isDeleted' field exists in the schema
  if (!("isDeleted" in carSchema.paths)) {
    // If 'isDeleted' field doesn't exist, remove 'all' condition and proceed
    if ("all" in this._conditions) {
      delete this._conditions.all;
    }
    return next();
  }

  // If 'all' condition is not present, add 'isDeleted' condition
  if (!("all" in this._conditions)) {
    this._conditions.isDeleted = false;
  } else {
    // If 'all' condition is present, remove it and proceed
    delete this._conditions.all;
  }

  next();
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
