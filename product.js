import mongoose from "mongoose";
const { Schema, model } = mongoose;

// Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
});

const Product = model("Product", productSchema);

export default Product;
