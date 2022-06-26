import { useEffect } from "react";
import { requestRoutes } from "../data/Routes";
import useAxiosData from "../hooks/useAxiosData";
import axios from "axios";
import Loading from "../components/UI/Loading";

function Profile(props) {
  const [data, makeRequest] = useAxiosData();

  useEffect(() => {
    makeRequest(axios.get(requestRoutes.getAll));
  }, []);

  if (data.loading) {
    return <Loading />;
  }

  return <div></div>;
}

Profile.isProtected = true;
export default Profile;
