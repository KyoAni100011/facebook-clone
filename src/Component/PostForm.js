import { useSelector } from "react-redux";
import { useState } from "react";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt, FaUserAlt } from "react-icons/fa";
import { RiShareForwardLine, RiTruckLine } from "react-icons/ri";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { BsEmojiSmile, BsCardImage } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { CommentUser } from "../Component/CommentUser";
import { auth, firestore } from "../firebase";
import {
  doc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  where,
  getDocs,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";
import { ReactComponent as Loader } from "../Loader.svg";
import { query, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export const PostForm = (props) => {
  const [commentPost, setCommentPost] = useState("");
  const [emojiState, setEmojiState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImage] = useState("");
  const [comments, setComments] = useState([]);
  const [imgInfo, setImgInfo] = useState();
  const [like, setLike] = useState(false);
  const [showCMTState, setCMTState] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const storage = getStorage();
  const [user] = useAuthState(auth);

  const emojiToggle = () => {
    setEmojiState(!emojiState);
  };

  const handleEmojiClick = (emoji) => {
    setCommentPost((prevContent) => prevContent + emoji.emoji);
  };

  const checkLike = async () => {
    try {
      await getDocs(collection(firestore, "Post")).then(
        async (querySnapshot) => {
          if (!querySnapshot.empty) {
            await getDocs(collection(firestore, "Post", props.id, "LikeUsers"))
              .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                  // Collection exists
                  querySnapshot.forEach((doc) => {
                    if (doc.data().username === user.displayName) {
                      setIsLike(true);
                      return;
                    }
                  });
                }
              })
              .catch((error) => {
                console.log("Error getting collection:", error);
              });
          }
        }
      );
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (props.id) {
      const commentRef = collection(firestore, "Post", props.id, "PostComment");
      const q = query(commentRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const promises1 = [];

        snapshot.docs.forEach((doc) => {
          const item = doc.data();

          promises1.push(Promise.resolve(item));
        });

        const arr = await Promise.all(promises1);

        setComments(arr);
      });

      return () => unsubscribe();
    }
  }, [props.id]);

  useState(async () => {
    checkLike();
  }, []);

  function showPreview(event) {
    if (event.target.files != undefined)
      if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        setImage(event.target.files[0].name);
        setImgInfo(event.target.files[0]);
        var preview = document.getElementById("file-preview");
        console.log(document.getElementsByClassName("img_upload")[0]);
        document.getElementsByClassName("img_upload")[0].classList.add("h-80");
        document
          .getElementsByClassName("img_upload")[0]
          .classList.add("overflow-y-scroll");
        preview.src = src;
        event.target.value = "";
        return event.target.files[0];
      }
  }

  const unLikeSubmit = async () => {
    if (isLike) setIsLike(false);
    else if (like) setLike(false);
    const likeNRef = doc(firestore, "Post", props.id);
    await getDocs(collection(firestore, "Post", props.id, "LikeUsers")).then(
      (data) =>
        data.docs.map((item) => {
          if (item.data().username == user.displayName) {
            deleteDoc(doc(firestore, "Post", props.id, "LikeUsers", item.id));
          }
        })
    );
    await updateDoc(likeNRef, { like: props.like - 1 });
  };

  const likeSubmit = async () => {
    if (!isLike) setIsLike(true);
    else if (!like) setLike(true);

    const likeRef = collection(firestore, "Post", props.id, "LikeUsers");
    const likeNRef = doc(firestore, "Post", props.id);

    await updateDoc(likeNRef, { like: props.like + 1 });
    await addDoc(likeRef, {
      username: user.displayName,
    });
  };

  const handleSubmit = async (e) => {
    if (commentPost != "") {
      setLoading(true);
      let time = serverTimestamp();
      try {
        const commentRef = doc(firestore, "Post", props.id);
        const storageRef = ref(storage, `images_comment/${images}`);
        if (images != "") {
          await uploadBytes(storageRef, imgInfo).then(async () => {
            await getDownloadURL(storageRef).then(async (url) => {
              await addDoc(collection(commentRef, "PostComment"), {
                timestamp: time,
                comment_post: commentPost,
                username: user.displayName,
                image: url,
              });
            });
          });
        } else {
          await addDoc(collection(commentRef, "PostComment"), {
            timestamp: time,
            comment_post: commentPost,
            username: user.displayName,
          });
        }
        const commentElement = document.getElementById("comment");
        if (commentElement) {
          commentElement.value = " ";
        }
        setImgInfo("");
        document
          .getElementsByClassName("img_upload")[0]
          .classList.remove("h-80", "overflow-y-scroll");
        document.getElementById("file-preview").removeAttribute("src");
        setLoading(false);
      } catch (error) {
        console.log("Error creating post:", error);
      }
    }
  };
  return (
    <div className="post_item bg-white my-4 rounded-md">
      <div className="wrapper_post mx-4 ">
        <div className="top_post flex items-center">
          <div className="top_left_post">
            <div className="user_image bg-wageningen_green py-2 px-2 rounded-full">
              <FaUserAlt></FaUserAlt>
            </div>
          </div>
          <div className="top_right_post">
            <div className="name_user">{props.username}</div>
            <div className="time_post">{props.timestampPost}</div>
          </div>
        </div>
        <div className="content_post">
          <div className="content_post_wrapper mt-3">
            {props.contentNewPost}
          </div>
        </div>
        <div className="img_post_wrapper">
          <img class="img_post" src={props.imagePost} />
        </div>
        <div className="post_info_reaction flex justify-between text-sm mt-2 font-medium">
          <div className="left_side">
            <div className="n_likes flex">
              <span className="flex items-center text-blue_facebook mr-2">
                <AiFillLike></AiFillLike>
              </span>
              {props.like}
            </div>
          </div>
          <div className="right_side flex">
            <div className="n_comments mr-2">
              {comments.length ? comments.length + " comments" : ""}
            </div>
            <div className="n_share"></div>
          </div>
        </div>
        <div className="post_reaction">
          <div className="wrapper border-y-2 border-gainsboro-500 my-4 py-1 flex font-bold">
            <div
              className={isLike ^ like ? "like text-blue_facebook" : "like"}
              onClick={() => {
                isLike ^ like ? unLikeSubmit() : likeSubmit();
              }}
            >
              {console.log(isLike, like)}
              {isLike ^ like ? (
                <AiFillLike></AiFillLike>
              ) : (
                <AiOutlineLike></AiOutlineLike>
              )}
              <span>Like</span>
            </div>
            <div className="comment">
              <FaRegCommentAlt></FaRegCommentAlt>
              <span>Comment</span>
            </div>
            <div className="share">
              <RiShareForwardLine></RiShareForwardLine>
              <span>Share</span>
            </div>
          </div>

          <div className="comment_area pb-2">
            {!comments.length ? (
              ""
            ) : showCMTState ? (
              comments.map((item, key) => (
                <CommentUser
                  user_cmt={item.username}
                  cmt={item.comment_post}
                  img={item.image}
                ></CommentUser>
              ))
            ) : (
              <div className="btn_show_comment pb-2">
                <a
                  className="font-bold text-sm"
                  onClick={() => setCMTState(!showCMTState)}
                  id="btn_showCMT"
                >
                  Show more comments
                </a>
              </div>
            )}
          </div>
          <div className="input_comment flex">
            <div className="user mr-2">
              <div className="user_image bg-wageningen_green py-2 px-2 rounded-full">
                <FaUserAlt></FaUserAlt>
              </div>
            </div>
            <div className="text_input grow bg-gray-200 p-3 rounded-xl mb-2">
              <div className="flex above">
                <div className="text_input_left_side grow">
                  <div class="form-group">
                    <textarea
                      className="form-control w-full px-2 bg-transparent"
                      name=""
                      id="comment"
                      rows="1"
                      placeholder="Écrivez un commentaire public..."
                      onChange={(e) => {
                        setCommentPost(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="img_upload">
                <img id="file-preview"></img>
              </div>
              <div className="text_input_full_side">
                <div className="tool flex justify-between">
                  <div className="left_tool flex">
                    <div className="btn_func btn_upload_image flex items-center">
                      <input
                        type="file"
                        id="btn_upload_file_post"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => showPreview(e)}
                      />
                      <label htmlFor="btn_upload_file_post">
                        <BsCardImage></BsCardImage>
                      </label>
                    </div>
                    <div className="btn_func emoji flex items-center">
                      <div className="btn_emoji flex justify-end">
                        <BsEmojiSmile
                          onClick={() => emojiToggle()}
                        ></BsEmojiSmile>
                      </div>
                      {emojiState && (
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      )}
                    </div>
                  </div>
                  <div className="right_tool">
                    <div className="btn_submit_container">
                      <button className="btn_submit">
                        {!loading ? (
                          <IoMdSend
                            className="text-blue-500"
                            onClick={() => handleSubmit()}
                          ></IoMdSend>
                        ) : (
                          <Loader className="spinner" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
