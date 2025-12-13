import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    sweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sweet",
      required: [true, "Sweet reference is required"],
    },
    sweetName: {
      type: String,
      required: [true, "Sweet name is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: [0, "Price cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient aggregation queries
PurchaseSchema.index({ purchaseDate: -1 });
PurchaseSchema.index({ category: 1, purchaseDate: -1 });
PurchaseSchema.index({ sweet: 1, purchaseDate: -1 });

const Purchase = mongoose.model("Purchase", PurchaseSchema);

export default Purchase;
