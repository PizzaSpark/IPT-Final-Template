const mongoose = require('mongoose');
const { Schema, model: _model } = mongoose;

const collectionName = 'film-data';
const requiredString = { type: String, required: true };
const requiredUniqueString = { type: String, required: true, unique: true };
const optionalString = { type: String };

const DataModel = new Schema(
  {
    poster: requiredString,
    title: requiredUniqueString,
    director: requiredString,
    year: requiredString,
    logline: optionalString,
  },
  { collection: collectionName } 
);

const model = _model(collectionName, DataModel);

module.exports = model;