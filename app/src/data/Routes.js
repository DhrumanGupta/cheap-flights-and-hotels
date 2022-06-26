const env = process.env.NODE_ENV || "development";

const domain =
  env === "development" ? "localhost:1337" : "backend.travelcheapwith.tech";
const basePath = `http${env !== "development" ? s : ""}://${domain}`;

const authKey = "auth";
const authBaseRoute = `${basePath}/${authKey}`;
export const authRoutes = {
  getUser: `${authBaseRoute}/user`,
  sendOtp: `${authBaseRoute}/sendOTP`,
  verifyOtp: `${authBaseRoute}/verifyOTP`,
  logout: `${authBaseRoute}/logout`,
};
