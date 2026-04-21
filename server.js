const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./confi/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRouter");
const categoryRoutes = require("./routes/categoryRouter");

const app = express();
dotenv.config();
connectDb();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
