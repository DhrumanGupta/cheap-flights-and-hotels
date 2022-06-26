import Link from "../components/Utils/Link";
import { default as NextLink } from "next/link";
import { Fragment, useEffect, useState } from "react";
import {
  sendOtp as loginUser,
  verifyOtp as validateUserLogin,
} from "../utils/userApi";
import Loading from "../components/UI/Loading";
import useAxiosData from "../hooks/useAxiosData";
import useUser from "../hooks/useUser";
import { TextInput, PasswordInput } from "../components/UI/Inputs";
import Card from "../components/UI/Card";
import { Header } from "../components/UI/Typography";
import Button from "../components/UI/Button";

const LoginPrompt = ({ onLogin, message, loading }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {}, 200);
    setFormValid(/^\+[1-9]\d{5,14}$/.test(phoneNumber));
    return () => {
      clearTimeout(timeout);
    };
  }, [phoneNumber]);

  const login = (e) => {
    e.preventDefault();

    if (!formValid) {
      return;
    }

    onLogin({ phone: phoneNumber });
  };


  const errorMessage =
    message &&
    (message.response?.data
      ? message.response.data[0]
      : message.toJSON().message);

  return (
    <div className="flex flex-col items-center justify-center my-auto flex-grow w-5/6 mx-auto">
      {errorMessage && (
        <p className={"text-red-500 pb-2 font-semibold text-lg"}>
          {errorMessage}
        </p>
      )}
      <Card>
        <Header ariaLabel="Login to your account">
          Login with phone number
        </Header>
        <br />
        <TextInput
          label={"Phone Number"}
          value={phoneNumber}
          setValue={setPhoneNumber}
          invalid={phoneNumber.length === 0 ? false : !formValid}
        />

        <div className="mt-8">
          <Button
            onClick={login}
            disabled={loading}
            aria-label={"login to my account"}
            className={"w-full"}
          >
            Login
          </Button>
        </div>
      </Card>

      {loading && (
        <Loading
          style={{
            position: "relative",
            marginTop: "2rem",
          }}
        />
      )}
    </div>
  );
};

const OtpPrompt = ({ requestData }) => {
  const [otp, setOtp] = useState("");
  const [otpValid, setOtpValid] = useState(true);
  const [message, setMessage] = useState({ error: false, value: "" });

  const { mutate } = useUser();

  const login = async () => {
    if (otp.trim().length !== 6) {
      setOtpValid(false);
      return;
    }
    setOtpValid(true);

    validateUserLogin({ ...requestData, otp: +otp })
      .then((resp) => {
        setMessage({
          error: false,
          value: "Login successful! You will be redirected shortly..",
        });
        mutate(null);
      })
      .catch((resp) => {
        setMessage({
          error: true,
          value: "Invalid OTP entered",
        });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center my-auto flex-grow w-5/6 mx-auto">
      {message.value && (
        <p
          className={`text-${
            message.error ? "red" : "emerald"
          }-500 pb-2 font-semibold text-lg`}
        >
          {message.value}
        </p>
      )}

      <Card>
        <Header ariaLabel="Enter OTP">Enter OTP</Header>
        <p className="text-sm mt-4 font-medium leading-none text-gray-500">
          Please enter the OTP sent on your Phone Number.{" "}
        </p>
        <br className={"my-5"} />

        <TextInput
          label={"OTP"}
          value={otp}
          setValue={setOtp}
          invalid={!otpValid}
        />

        <div className="mt-8">
          <Button className={"w-full"} onClick={login}>
            Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

function Login() {
  const [loginData, makeLoginRequest] = useAxiosData();

  const login = (credentials) => {
    makeLoginRequest(
      loginUser({
        ...credentials,
        medium: "email",
      })
    );
  };

  return (
    <>
      {loginData.data ? (
        <OtpPrompt requestData={loginData.data} />
      ) : (
        <LoginPrompt
          message={loginData.error}
          onLogin={login}
          loading={loginData.loading}
        />
      )}
    </>
  );
}

Login.isAnonymous = true;

export default Login;
