import auth from "../config/firebase-config.js";

export const getAllUsers = async (req, res) => {
  try {
    const maxResults = 10;
    const userRecords = await auth.listUsers(maxResults);
    const users = userRecords.users.map(({ uid, email, displayName, photoURL }) => ({
      uid, email, displayName, photoURL,
    }));
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);
    const { uid, email, displayName, photoURL } = userRecord;
    res.status(200).json({ uid, email, displayName, photoURL });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};