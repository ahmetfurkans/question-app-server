import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();

const url = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.send('StackOver backend');
});

app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/user', userRoutes);

mongoose
  .connect(url, {
    //mongoose configs
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on Port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
