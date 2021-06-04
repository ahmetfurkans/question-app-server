import jwt from 'jsonwebtoken';

function auth(req, res, next) {
  const token = req.header('x-auth-token');
  //Check for token
  if (!token)
    return res.status(401).json({ msg: ' No token, auhorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    //Add user to payload
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).json({ msg: 'Token is not valid' });
  }
}
export default auth;
