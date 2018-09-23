import { JsonWebTokenError, verify } from 'jsonwebtoken';

function authenticate(req, res, next) {
  if (req.method === 'GET' || req.method === 'OPTIONS') { return next(); }
  if (req.method === 'POST' && req.path === '/users') { return next(); }
  if (req.method === 'POST' && req.path === '/login') { return next(); }
  const authorization = req.get('Authorization');

  if (authorization === undefined) {
    res.status(401);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'The Authorization header must be set' });
  }

  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer') {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'The Authorization header should use the Bearer scheme' });
  }

  const jwtRegEx = /^[\w-]+\.[\w-]+\.[\w-.+/=]*$/;

  // If no token was provided, or the token is not a valid JWT token, return with a 400
  if (!token || !jwtRegEx.test(token)) {
    res.status(400);
    res.set('Content-Type', 'application/json');
    return res.json({ message: 'The credentials used in the Authorization header should be a valid bcrypt digest' });
  }

  verify(token, process.env.PUBLIC_KEY, { algorithms: ['RS512'] }, (err, decodedToken) => {
    if (err) {
      if (err instanceof JsonWebTokenError && err.message === 'invalid signature') {
        res.status(400);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'Invalid signature in token' });
      }
      res.status(500);
      res.set('Content-Type', 'application/json');
      return res.json({ message: 'Internal Server Error' });
    }
    req.user = Object.assign({}, req.user, { id: decodedToken.sub });
    return next();
  });
  return undefined;
}
export default authenticate;
