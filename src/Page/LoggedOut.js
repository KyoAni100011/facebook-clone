import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Popup from "reactjs-popup";
import { auth } from "../firebase";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { ReactComponent as Loader } from "../Loader.svg";
import { Error_Text } from "../ErrorText";
import { useNavigate } from "react-router";
import { updateProfile } from "firebase/auth";

export const LoggedOut = () => {
  const navigate = useNavigate();
  const [isOpenPopup, setPopupState] = useState(false);
  const triggerPopup = () => {
    setPopupState(!isOpenPopup);
  };
  const [displayNameC, setDisplayName] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [cp, setCp] = useState("");
  const [errorState, setErrorState] = useState(0);
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, user1, loading1, error1] =
    useSignInWithEmailAndPassword(auth);
  const SignUp = () => {
    if (cp != password) setErrorState(1);
    else if (error) setErrorState(2);
    else {
      createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          return updateProfile(user, { displayName: displayNameC });
        })
        .then(() => {
          console.log("Profile updated successfully!");
          // Tiếp tục xử lý sau khi đăng ký và cập nhật thông tin người dùng
        })
        .catch((error) => {
          console.log("Error:", error.message);
          // Xử lý lỗi
        });
    }
    if (!loading) navigate("/home");
  };
  const Login = () => {
    signInWithEmailAndPassword(emailLogin, passwordLogin);
    if (!loading1) navigate("/home");
  };
  const Error = () => {
    switch (errorState) {
      case 1:
        return (
          <div>
            <p>Password and confirm password does not match.</p>
          </div>
        );
      case 2:
        console.log(error.message);
        return (
          <div>
            <p>{Error_Text[error.message]}</p>
          </div>
        );
      default:
        return <div></div>;
    }
  };
  return (
    <div className="UIPage_LoggedOut">
      <div className="global_container">
        <div className="fb_content flex">
          <div className="fb_layout_left">
            <div className="fb_logo_wrap">
              <img
                className="fb_logo"
                src="https://static.xx.fbcdn.net/rsrc.php/y8/r/dF5SId3UHWd.svg"
              ></img>
            </div>
            <div className="fb_subscript">
              <h2>
                Facebook helps you connect and share with the people in your
                life.
              </h2>
            </div>
          </div>
          <div className="fb_layout_right mt-10">
            <div className="fb_layout_right_wrap">
              <div className="form-group">
                <form>
                  <div className="input_username_wrap">
                    <input
                      type="text"
                      name="email"
                      id="email"
                      placeholder="Email address or phone number"
                      onChange={(e) => setEmailLogin(e.target.value)}
                    />
                  </div>
                  <div className="input_password_wrap">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      onChange={(e) => setPasswordLogin(e.target.value)}
                    />
                  </div>
                </form>
              </div>
              <div className="btn_login_wrap">
                <button className="btn_login" onClick={() => Login()}>
                  {!loading1 ? "Login" : <Loader className="spinner" />}
                </button>
              </div>
              <div className="forgotten_password_wrap">
                <a href="#">Forgotten password ?</a>
              </div>
              <div className="line w-full border-t-2 border-gainsboro-500 mt-6"></div>
              <div className="create_new_account_wrap">
                <button
                  className="btn_signup bg-wageningen_green py-3 px-6 text-white font-bold mt-4 mb-3 rounded"
                  onClick={() => triggerPopup()}
                >
                  Create new account
                </button>
              </div>
              <Popup open={isOpenPopup} closeOnDocumentClick={false}>
                <div className="top_popup flex justify-between">
                  <div className="title_signup pb-3">
                    <h1 className="text-3xl font-bold">Sign Up</h1>
                    <h3 className="text-granite_gray">It's quick and easy.</h3>
                  </div>
                  <div className="btn_close_popup_wrap">
                    <button
                      className="btn_close_popup text-xl"
                      onClick={() => triggerPopup()}
                    >
                      <AiOutlineClose></AiOutlineClose>
                    </button>
                  </div>
                </div>
                <div className="line-full"></div>
                <div className="body_popup">
                  <div class="form-group grid-cols-1 text-center">
                    <input
                      type="email"
                      class="form-control"
                      placeholder="Email address or phone number"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Confirm password"
                      onChange={(e) => setCp(e.target.value)}
                    />
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Username"
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                    {Error()}
                    <button
                      className="btn-signup px-16 py-2 bg-wageningen_green text-white font-bold rounded text-lg my-3"
                      onClick={() => SignUp()}
                    >
                      {!loading ? "Sign Up" : <Loader className="spinner" />}
                    </button>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
