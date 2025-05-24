import User from "../models/login.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// GET ALL USERS
async function getUsers(req, res) {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// GET USER BY ID
async function getUserById(req, res) {
  try {
    const response = await User.findOne({
      where: { id: req.params.id }
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
}

// CREATE USER / REGISTER
async function createUser(req, res) {
  try {
    const inputResult = req.body;
    const encryptPassword = await bcrypt.hash(inputResult.password, 5);
    await User.create({
      name: inputResult.name,
      email: inputResult.email,
      gender: inputResult.gender,
      password: encryptPassword
    });
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
  }
}

// UPDATE USER
async function updateUser(req, res) {
  try {
    const inputUser = req.body;
    let updateData = {
      name: inputUser.name,
      email: inputUser.email,
      gender: inputUser.gender
    };

    if (inputUser.password) {
      const encryptPassword = await bcrypt.hash(inputUser.password, 5);
      updateData.password = encryptPassword;
    }

    const result = await User.update(updateData, {
      where: { id: req.params.id }
    });

    if (result[0] === 0) {
      return res.status(404).json({
        status: 'failed',
        message: 'User tidak ditemukan atau tidak ada data yang berubah',
        updateData,
        result
      });
    }

    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
}

// DELETE USER
async function deleteUser(req, res) {
  try {
    await User.destroy({
      where: { id: req.params.id }
    });
    res.status(204).json({ msg: "User berhasil dihapus" });
  } catch (error) {
    console.log(error.message);
  }
}

// LOGIN
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const userPlain = user.toJSON();
      const { password: _, refresh_token: __, ...safeUserData } = userPlain;

      const decryptPassword = await bcrypt.compare(password, user.password);
      if (decryptPassword) {
        const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "30s"
        });

        const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: "1d"
        });

        await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: false,
          sameSite: "none",
          secure: true, //ini nanti ganti kalo kegcp
          maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
          status: "Success",
          message: "Login Berhasil",
          safeUserData,
          accessToken
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Password atau email salah"
        });
      }
    } else {
      res.status(400).json({
        status: "Failed",
        message: "Password atau email salah"
      });
    }
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message
    });
  }
}

// LOGOUT
async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({ where: { refresh_token: refreshToken } });
  if (!user) return res.sendStatus(204);

  await User.update({ refresh_token: null }, { where: { id: user.id } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
}

// EXPORTS
export {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginHandler,
  logout
};