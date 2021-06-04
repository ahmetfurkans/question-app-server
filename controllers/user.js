import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Kayıt olmak
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  const oldEmail = await User.find({ email: email });
  //Check exist email
  if (oldEmail.length !== 0) {
    return res.status(501).json({ msg: 'This email has used' });
  }

  //Email  valid check

  const newUser = new User({ username, email, password });
  try {
    if (password) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().then(user => {
            jwt.sign(
              {
                id: user._id,
                username: user.username,
              },
              process.env.jwtSecret,
              { expiresIn: 3600 },
              (err, token) => {
                if (err) throw err;
                res.status(201).json({
                  token: token,

                  user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                  },
                });
              }
            );
          });
        });
      });
    }
  } catch (error) {
    res.status(409).json({ msg: error.message });
  }
};

//Giriş
export const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(400).send({ msg: 'There is not account like that' });
    }
    //Password eşleşiyormu
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.jwtSecret,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({
            token: token,
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
            },
          });
        }
      );
    });
  });
};

//Token geçerli olup olmadığını kontrol etmek için
export const getUser = (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => {
      res.json(user);
    })
    .catch(err => res.status(400).json({ msg: err }));
};
