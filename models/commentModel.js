import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
  msg: { type: String },

  creator: {
    _id: { type: Schema.Types.ObjectId },
    username: { type: String },
  },
  likes: [Schema.Types.ObjectId],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  postId: { type: Schema.Types.ObjectId },
});

let Comment = mongoose.model('Comment', commentSchema);

export default Comment;
