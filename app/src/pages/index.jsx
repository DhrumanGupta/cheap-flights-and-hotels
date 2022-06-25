import Head from "next/head";
import Image from "next/image";
import Search from "../components/icons/Search";

export default function Home() {
  return (
    <>
      <div className="form-control absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-3/4 sm:w-auto p-6">
        <h2 className="mb-2 text-center">Never pay high prices again</h2>
        <label className="input-group w-full">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter your destination"
          />
          <button className="btn btn-square">
            <Search />
          </button>
        </label>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <div className="duration-100 relative w-full aspect-h-1 aspect-w-4 md:-bottom-10 lg:-bottom-24 xl:-bottom-36 2xl:-bottom-48">
          <Image src="/landing.png" layout="fill" alt="Sand" />
        </div>
      </div>
    </>
  );
}
