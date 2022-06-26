const env = process.env.NODE_ENV || "development";

const domain =
  env === "development" ? "localhost:1337" : "backend.travelcheapwith.tech";
const basePath = `http${env !== "development" ? s : ""}://${domain}`;

const authBaseRoute = `${basePath}/auth`;
export const authRoutes = {
  getUser: `${authBaseRoute}/user`,
  sendOtp: `${authBaseRoute}/sendOTP`,
  verifyOtp: `${authBaseRoute}/verifyOTP`,
  logout: `${authBaseRoute}/logout`,
};

const requestBaseRoute = `${basePath}/request`;
export const requestRoutes = {
  add: `${requestBaseRoute}/add`,
  getPrice: `${requestBaseRoute}/`,
  getAll: `${requestBaseRoute}/`,
  get: (slug) => `${requestBaseRoute}/${slug}`,
  delete: (slug) => `${requestBaseRoute}/${slug}`,
};
