import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  // console.log("HERE");
  const authorization = req.headers.authorization;
  // console.log(authorization);
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        // decodes is the jwt object that we created when calling jwt.sign above in the generateToken method.
        req.user = decode;
        // console.log("HERES " + Object.keys(decode)[0]);
        // console.log("HERE " + decode.name);
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next) => {
  // console.log("HERE");
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};
