import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error}`);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log(`MongoDB disconnected.`);
  } catch (error) {
    console.error(`MongoDB failed to disconnect properly.`);
  }
};
