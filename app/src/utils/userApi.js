import axios from "axios";
import { authRoutes } from "../data/Routes";

axios.defaults.withCredentials = true;

export const getUser = async () => {
  const resp = await axios.get(authRoutes.getUser);
  return resp.data;
};

export const sendOtp = async ({ phone }) => {
  return await axios.post(authRoutes.sendOtp, {
    phone,
  });
};

export const verifyOtp = async ({ phone, hash, otp }) => {
  return await axios.post(authRoutes.verifyOtp, { phone, hash, otp });
};

export const logout = async () => {
  await axios.post(authRoutes.logout);
};
