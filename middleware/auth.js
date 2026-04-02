const {getUser} = require('../services/auth')

async function restrictToLoggedin(req,res,next) {
  

  // if(!userUid) return res.redirect('/login');
  
  

  const user = getUser(userUid);

  if(!user) return res.redirect('/login')

    req.user = user;
    next();
}

async function checkAuth(req,res,next) {
  // const userUid = req.cookies?.uid;
  const authHeader = req.headers['authorization'];
  let token = authHeader //Bearer <token>
  token = token.split('Bearer')[1]; //"Bearer  [23jktgferjikfj34r]"
  const user = getUser(authHeader);
    req.user = user;
    next();
}

module.exports = {
  restrictToLoggedin,
  checkAuth,
}