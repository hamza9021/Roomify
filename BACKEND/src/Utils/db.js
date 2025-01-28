import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URL
        );
        console.log("MONGO DB CONNECTED ", connectionInstance.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export { connectDB };
