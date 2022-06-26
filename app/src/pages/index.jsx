import Head from "next/head";
import Image from "next/image";
import Search from "../components/icons/Search";
import useAxiosData from "../hooks/useAxiosData";
import axios from "axios";
import { requestRoutes } from "../data/Routes";
import { useRef, useState } from "react";
import Loading from "../components/UI/Loading";
import Link from "next/link";

const defaultError = { error: false, value: "" };

export default function Home() {
  const [data, makeRequest] = useAxiosData();
  const linkInput = useRef(null);
  const priceInput = useRef(null);

  const [message, setMessage] = useState(defaultError);

  return (
    <>
      <Head>
        <title>Home - Travel Cheap</title>
      </Head>
      <div className="form-control w-5/6 md:w-2/3 lg:w-1/2 mx-auto mt-16">
        <h2 className="mb-2 text-center">Never pay high prices again</h2>
        <label className="input-group w-full">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter a link from our supported websites"
            ref={linkInput}
          />
          <button
            className="btn btn-square"
            onClick={() => {
              makeRequest(
                axios({
                  method: "POST",
                  url: requestRoutes.getPrice,
                  data: { url: linkInput.current.value },
                })
              );
            }}
          >
            <Search />
          </button>
        </label>

        {message.value && (
          <p className={message.error ? "text-red-600" : "text-green-600"}>
            {message.value}
          </p>
        )}

        {data.loading ? (
          <Loading />
        ) : (
          data.data && (
            <div className="mt-10">
              <span>
                <h3>The current price is {data.data.price}</h3>
                <p>We can remind you when the price reduces.</p>
              </span>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Enter Target Price</span>
                </label>
                <label className="input-group">
                  <input
                    type="number"
                    placeholder={data.data.price}
                    className="input input-bordered"
                    ref={priceInput}
                  />
                  <button
                    className="btn"
                    onClick={async () => {
                      if (+priceInput.current.value >= data.data.price) {
                        setMessage({
                          error: true,
                          value: "Target price must be less than current price",
                        });
                        return;
                      }
                      setMessage(defaultError);
                      try {
                        await axios.post(requestRoutes.add, {
                          url: linkInput.current.value,
                          target: +priceInput.current.value,
                        });
                        setMessage({ error: false, value: "Success!" });
                      } catch (err) {
                        setMessage({
                          error: true,
                          value: err.response?.data
                            ? err.response.data.message
                            : err.toJSON().message,
                        });
                      }
                    }}
                  >
                    Remind me
                  </button>
                </label>
              </div>
            </div>
          )
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="duration-100 relative w-full aspect-h-1 aspect-w-4 md:-bottom-10 lg:-bottom-24 xl:-bottom-36 2xl:-bottom-48">
          <Image src="/landing.png" layout="fill" alt="Sand" />
        </div>
      </div>

      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Congratulations random Interner user!
          </h3>
          <p className="py-4">
            To track items, please login using your phone number.
          </p>
          <div className="modal-action">
            <Link href="/login">
              <a htmlFor="my-modal" className="btn">
                Login
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
