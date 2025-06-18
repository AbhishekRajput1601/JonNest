import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDatabase = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("Connected to the database.");
        })
        .catch((err) => {
            console.error(`Error occurred while connecting to the database: ${err.message}`);
            process.exit(1); // Exit the process with a failure code
        });
};

export { connectToDatabase };
