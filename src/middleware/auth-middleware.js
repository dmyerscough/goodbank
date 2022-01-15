let admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SVC_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getAuthToken = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
};

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.userId = userInfo.user_id;
      req.userEmail = userInfo.email;
      return next();
    } catch (e) {
      return res
        .status(401)
        .send({ error: "You are not authorized to make this request" });
    }
  });
};

module.exports = {
  checkIfAuthenticated,
};
