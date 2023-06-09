import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { BsPass, BsUpload } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { postAction } from "../Redux/Post";
import { PostForm } from "./PostForm";
import { firestore } from "../firebase";
import { ReactComponent as Loader } from "../Loader.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

import {
  doc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const UserPost = () => {
  const [posts, setPosts] = useState([]);
  const [imagesUpPost, setImageUpPost] = useState("");
  const [user, loading1, error] = useAuthState(auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imgInfoUpPost, setImgInfoUpPost] = useState();
  const [emoji, setEmoji] = useState();
  const colRef = collection(firestore, "Post");
  const storage = getStorage();
  const [emojiState, setEmojiState] = useState(false);
  const [isUploadFile, setUploadFile] = useState(false);

  const [isOpen, setStatePopup] = useState(false);
  const [contentPost, setContentPost] = useState("");
  const [hiddenLayer, setHiddenLayer] = useState("none");
  const handlePopup = () => {
    if (hiddenLayer == "none") setHiddenLayer("block");
    else setHiddenLayer("none");
    setStatePopup(!isOpen);
  };

  useEffect(() => {
    const collectionRef = collection(firestore, "Post");
    let arr = [];
    const unsubscribe = onSnapshot(collectionRef, async (snapshot) => {
      const promises = [];

      snapshot.forEach((doc) => {
        const item = doc.data();
        const id = doc._document.key.path.segments[6];

        item["id"] = id;

        promises.push(Promise.resolve(item));
      });

      const arr = await Promise.all(promises);

      setPosts(arr);
      setUploadFile(true);
    });
    // Cleanup function để hủy đăng ký khi component bị unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const createPost = async (e) => {
    setLoading(true);
    let time = serverTimestamp();
    try {
      dispatch(
        postAction.addPost({
          payload: {
            displayname: user.displayName,
            content: contentPost,
            image: imagesUpPost,
          },
        })
      );
      if (imagesUpPost != "") {
        const storageRef = ref(storage, `images/${imagesUpPost}`);
        await uploadBytes(storageRef, imgInfoUpPost).then(async () => {
          await getDownloadURL(storageRef).then(async (url) => {
            await addDoc(collection(firestore, "Post"), {
              displayname: user.displayName,
              content: contentPost,
              image: url,
              timestamp: time,
              like: 0,
            });
          });
        });
      } else {
        await addDoc(collection(firestore, "Post"), {
          displayname: user.displayName,
          content: contentPost,
          timestamp: time,
          like: 0,
        });
      }
      setContentPost("");
      setImgInfoUpPost("");
      setImageUpPost("");
      setLoading(false);
      handlePopup();
    } catch (error) {
      console.log("Error creating post:", error);
    }
  };

  const handleEmojiClick = (emoji) => {
    setEmoji(emoji);
    setContentPost((prevContent) => prevContent + emoji.emoji);
  };

  const emojiToggle = () => {
    setEmojiState(!emojiState);
  };

  function showPreviewUpPost(event) {
    if (event.target.files != undefined) {
      if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        console.log(src);
        setImageUpPost(event.target.files[0].name);
        setImgInfoUpPost(event.target.files[0]);
        var preview = document.getElementById("file-preview-up-post");
        document
          .getElementsByClassName("img_upload_up_post")[0]
          .classList.add("h-80");
        document
          .getElementsByClassName("img_upload_up_post")[0]
          .classList.add("overflow-y-scroll");
        event.target.value = "";
        preview.src = src;
      }
    }
  }

  return (
    <div className="container_post">
      <div
        className="layer_hidden absolute top-0 left-0 right-0 bottom-0 "
        style={{ display: hiddenLayer }}
      ></div>
      <div className="UserPostContainer mt-6">
        <div className="wrapper py-3 px-4">
          <div className="user_icon mr-3">User</div>
          <div className="input_symbols" onClick={() => handlePopup()}>
            What's up
          </div>
          <Popup open={isOpen} closeOnDocumentClick={false}>
            <div className="top_popup flex justify-end relative">
              <div className="title absolute right-1/2 translate-x-1/2 text-lg font-bold">
                Create one publication
              </div>
              <div className="btn_close_popup">
                <button
                  className="btn_close bg-gainsboro p-1 rounded-full"
                  onClick={() => handlePopup()}
                >
                  <AiOutlineClose></AiOutlineClose>
                </button>
              </div>
            </div>
            <div className="body_popup">
              <div className="line w-full border-t-2 border-gainsboro-800 mt-6 mb-3"></div>
              <div className="text_input">
                <div class="form-group">
                  {console.log(posts)}
                  <textarea
                    className="form-control w-full px-2"
                    name=""
                    id=""
                    rows="3"
                    placeholder="What's up ?"
                    value={contentPost}
                    onChange={(e) => setContentPost(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="img_upload_up_post">
                <img id="file-preview-up-post"></img>
              </div>
              <div className="tool flex items-center justify-between">
                <div className="btn_upload_image my-2">
                  <input
                    type="file"
                    id="btn_upload_file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      showPreviewUpPost(e);
                    }}
                  />
                  <label
                    htmlFor="btn_upload_file"
                    className=" bg-wageningen_green text-white px-2 py-1 rounded"
                  >
                    <BsUpload className="inline-block mr-2"></BsUpload>
                    <span>Image</span>
                  </label>
                </div>
                <div className="emoji">
                  <div className="btn_emoji flex justify-end">
                    <BsEmojiSmile onClick={() => emojiToggle()}></BsEmojiSmile>
                  </div>
                  {emojiState && (
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  )}
                </div>
              </div>
              <div
                className="btn_post w-full text-center flex justify-center"
                onClick={() => createPost()}
              >
                {!loading ? "Post" : <Loader className="spinner" />}
              </div>
            </div>
          </Popup>
        </div>
      </div>
      <div className="content">
        {!isUploadFile ? (
          <div className="loader flex justify-center">
            <Loader className="spinner mt-10" height="100" width="100" />
          </div>
        ) : posts.length != 0 ? (
          posts.map((item, key) => {
            return (
              <PostForm
                contentNewPost={item.content}
                key={key}
                username={item.displayname}
                imagePost={item.image}
                timestampPost={item.timestamp
                  ?.toDate()
                  .toString()
                  .replace("GMT+0700 (Indochina Time)", "")}
                id={item.id}
                user={item.displayName}
                like={item.like}
              ></PostForm>
            );
          })
        ) : (
          <div className="no_post">No Post</div>
        )}
      </div>
    </div>
  );
};
