import mongoose from "mongoose";

// Function to connect to the mongodb database
export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => 
            console.log("MongoDB Connected Successfully")
        );

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    } catch (error) {
        console.log("MongoDB Connection Error:", error);
        process.exit(1);
    }
};
