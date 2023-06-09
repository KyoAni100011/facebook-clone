import { ReactComponent as Logo } from "../LogoFacebook.svg";
import { AiFillHome } from "react-icons/ai";
import { MdScreenShare, MdOutlinePeopleOutline } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { SiYoutubegaming } from "react-icons/si";
import { BsMessenger } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { UserPost } from "../Component/UserPost";
import { FaUserAlt } from "react-icons/fa";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useState } from "react";

export const Home = () => {
  const [signOut, loading, error] = useSignOut(auth);
  const [showMenuUser, setShowMenuUser] = useState(false);
  const navigator = useNavigate();
  return (
    <div className="container h-screen">
      <nav>
        <div className="wrapper flex justify-between items-center relative py-1">
          <div className="leftside_nav flex">
            <div className="nav_logo flex items-center ml-4">
              <div className="nav_logo_wrap mr-2">
                <Logo className="logo_facebook"></Logo>
              </div>
            </div>
            <div className="search_bar">
              <form>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    id="default-search"
                    class="input_search block px-10 py-3 pl-10 text-sm text-gray-900 border rounded-full"
                    placeholder="Search Mockups, Logos..."
                    required
                  />
                </div>
              </form>
            </div>
          </div>
          <div className="centerside_nav flex absolute h-full left-1/2 items-center">
            <div className="icon_home">
              <NavLink to="/home">
                <AiFillHome></AiFillHome>
              </NavLink>
            </div>
            <div className="icon_watch">
              <NavLink to="/watch">
                <MdScreenShare></MdScreenShare>
              </NavLink>
            </div>
            <div className="icon_market">
              <NavLink to="/market">
                <FaStore></FaStore>
              </NavLink>
            </div>
            <div className="icon_group">
              <NavLink to="/groups">
                <MdOutlinePeopleOutline></MdOutlinePeopleOutline>
              </NavLink>
            </div>
            <div className="icon_gaming">
              <NavLink to="/gaming">
                <SiYoutubegaming></SiYoutubegaming>
              </NavLink>
            </div>
          </div>
          <div className="rightside_nav flex items-center mr-4">
            <div className="message mr-3">
              <BsMessenger></BsMessenger>
            </div>
            <div
              className="User bg-wageningen_green py-3 px-3 rounded-full"
              onClick={() => setShowMenuUser(!showMenuUser)}
            >
              <FaUserAlt></FaUserAlt>
            </div>
            {showMenuUser && (
              <div className="menu_user absolute bottom-0 top-16">
                <button
                  onClick={async () => {
                    const success = await signOut();
                    navigator("/");
                    if (success) {
                      alert("You are sign out");
                    }
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="body_content">
        <UserPost></UserPost>
      </div>
    </div>
  );
};
