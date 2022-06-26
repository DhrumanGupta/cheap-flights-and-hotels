import Navbar from "../components/Navbar";
import "../styles/globals.css";
import ProtectedPage from "../components/Auth/ProtectedPage";
import AnonymousPage from "../components/Auth/AnonymousPage";

function MyApp({ Component, pageProps }) {
  const isProtected = Component.isProtected;
  const isAnonymous = Component.isAnonymous;

  if (isProtected && isAnonymous) {
    throw new Error(
      `The component ${Component.name} is anonymous and protected as the same time. Please choose either one`
    );
  }

  return (
    <>
      <Navbar />
      {isProtected ? (
        <ProtectedPage>
          <Component {...pageProps} />
        </ProtectedPage>
      ) : isAnonymous ? (
        <AnonymousPage>
          <Component {...pageProps} />
        </AnonymousPage>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}

export default MyApp;
