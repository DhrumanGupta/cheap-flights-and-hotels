import React from "react";
import Link from "next/link";
import useUser from "../hooks/useUser";
import { authRoutes } from "../data/Routes";
import axios from "axios";

const NavItem = ({ to, children }) => {
  return (
    <li>
      <Link href={to}>
        <a>{children}</a>
      </Link>
    </li>
  );
};

const LoggedInRoutes = () => {
  return (
    <>
      <NavItem to="profile">Profile</NavItem>
      <li>
        <p
          onClick={async () => {
            await axios.post(authRoutes.logout);
          }}
        >
          Logout
        </p>
      </li>
    </>
  );
};

const LoggedOutRoutes = () => {
  return (
    <>
      <NavItem to="/login">Login</NavItem>
    </>
  );
};

function Navbar(props) {
  const { loggedIn } = useUser();

  return (
    <nav className="navbar">
      <div className="flex-1">
        <Link href="/">
          <h1 className="btn btn-ghost normal-case text-xl lg:text-2xl">
            Travel Cheap
          </h1>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <NavItem to="/how">How</NavItem>
          {loggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
