import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  tags: [String],
  creator: {
    _id: { type: Schema.Types.ObjectId },
    username: { type: String },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: { type: Number, default: 0 },
});

let Post = mongoose.model('Post', postSchema);

export default Post;
