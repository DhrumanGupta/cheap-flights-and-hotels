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

  return (
    <>
      <div className="w-5/6 md:w-2/3 lg:w-1/2 mx-auto mt-16">
        <h2>You are tracking the following items:</h2>
        {data.data &&
          data.data.map((item, i) => (
            <div key={i} className="my-4">
              <p>Target: {item.target}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="link text-white"
              >
                Url
              </a>
            </div>
          ))}
      </div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
    </>
  );
}

Profile.isProtected = true;
export default Profile;
