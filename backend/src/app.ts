import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

export default app;