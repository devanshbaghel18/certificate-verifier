const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(
  "744681437520-n5gobflm75fl520103hc8iu4q88qldml.apps.googleusercontent.com"
);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "744681437520-n5gobflm75fl520103hc8iu4q88qldml.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();

    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    const backendToken = jwt.sign(user, "super_secret_key", {
      expiresIn: "1d",
    });

    res.json({ token: backendToken, user });

  } catch (error) {
    res.status(401).json({ message: "Invalid Google Token" });
  }
};

module.exports = { googleLogin };