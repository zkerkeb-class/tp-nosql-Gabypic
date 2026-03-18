import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI n’est pas défini dans le fichier .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connecté à MongoDB !');
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB :', error);
    process.exit(1);
  }
};

export default connectDB;

