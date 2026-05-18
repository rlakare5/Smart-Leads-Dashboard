import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

dotenv.config();

const seed = async (): Promise<void> => {
  try {
    await connectDB();

    await Promise.all([Lead.deleteMany({}), User.deleteMany({})]);
    console.log('Cleared existing users and leads');

    const adminPassword = await bcrypt.hash('admin123', 12);
    const salesPassword = await bcrypt.hash('sales123', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.com',
      password: adminPassword,
      role: 'admin',
    });

    const sales = await User.create({
      name: 'Sales User',
      email: 'sales@smartleads.com',
      password: salesPassword,
      role: 'sales',
    });

    await Lead.insertMany([
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        status: 'Qualified',
        source: 'Instagram',
        createdBy: admin._id,
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        status: 'New',
        source: 'Website',
        createdBy: sales._id,
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        status: 'Contacted',
        source: 'Referral',
        createdBy: sales._id,
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        status: 'Lost',
        source: 'Website',
        createdBy: admin._id,
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        status: 'Qualified',
        source: 'Instagram',
        createdBy: admin._id,
      },
    ]);

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Login credentials:');
    console.log('  Admin: admin@smartleads.com / admin123');
    console.log('  Sales: sales@smartleads.com / sales123');
    console.log('\nCollections created: users, leads');
    console.log('Database:', mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
