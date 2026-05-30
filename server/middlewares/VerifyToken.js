import auth from "../config/firebase-config.js";

export const VerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeValue = await auth.verifyIdToken(token);
    req.user = decodeValue;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("Unauthorized: missing token"));
  }

  try {
    const decodeValue = await auth.verifyIdToken(token);
    socket.user = decodeValue;
    return next();
  } catch (e) {
    return next(new Error("Unauthorized: invalid token"));
  }
};