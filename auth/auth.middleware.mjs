
import ApiError from "../common/utils/api-error.mjs";
import { verifyAccessToken } from "../common/utils/jwt.utils.mjs";
import { query } from "../config/db.mjs";
import { GET_USER_BY_USERID } from "./auth.query.mjs";

const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }


  if (!token) throw ApiError.unauthorized("Not Autheticated");
  // console.log(token)
  const decoded = verifyAccessToken(token);
  const user = await query(GET_USER_BY_USERID, [decoded.id]);
  // console.log(user.rows[0])
  if (!user.rows.length) throw ApiError.unauthorized("User no longer exists");

  req.user = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
  };
  next();
};

export { authenticate };
