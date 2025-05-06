import mongoose from "mongoose";

type ConnectionObect = {
  isConnected?: number;
};

const connection: ConnectionObect = {};

const dbConnect = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already Connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL!);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("database connection failed", error);
    process.exit(1);
  }
};
