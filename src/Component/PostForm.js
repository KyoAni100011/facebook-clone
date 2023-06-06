import { useSelector } from "react-redux";
import { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentAlt, FaUserAlt } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsCardImage } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { CommentUser } from "../Component/CommentUser";
import { firestore } from "../firebase";
import {
  doc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const PostForm = (props) => {
  const [commentPost, setCommentPost] = useState("");
  const [emojiState, setEmojiState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImage] = useState("");
  const [imgInfo, setImgInfo] = useState();
  const storage = getStorage();
  const emojiToggle = () => {
    setEmojiState(!emojiState);
  };
  function showPreview(event) {
    console.log(event);
    if (event.target.files != undefined)
      if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        setImage(event.target.files[0].name);
        setImgInfo(event.target.files[0]);
        console.log(event.target.file[0]);
        var preview = document.getElementById("file-preview");
        document.getElementsByClassName("img_upload")[0].classList.add("h-80");
        document
          .getElementsByClassName("img_upload")[0]
          .classList.add("overflow-y-scroll");
        preview.src = src;
        return event.target.files[0];
      }
  }

  const createPost = async (e) => {
    setLoading(true);
    let time = serverTimestamp();
    try {
      const storageRef = ref(storage, `images/${images}`);
      await addDoc(collection(firestore, "Post"), {
        image: images,
        timestamp: time,
      });
      setImgInfo("");
      await uploadBytes(storageRef, imgInfo);
      setLoading(false);
    } catch (error) {
      console.log("Error creating post:", error);
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
        <div className="post_reaction">
          <div className="wrapper border-y-2 border-gainsboro-500 my-4 py-1 flex">
            <div className="like">
              <AiOutlineLike></AiOutlineLike>
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
                      id=""
                      rows="3"
                      placeholder="Écrivez un commentaire public..."
                      onInput={(e) => {
                        setCommentPost(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className="text_input_right_side">
                  <div className="tool_right flex">
                    <div className="btn_func btn_upload_image flex items-center">
                      <input
                        type="file"
                        id="btn_upload_file_post"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => showPreview(e)}
                      />
                      <label for="btn_upload_file_post flex grid">
                        <BsCardImage></BsCardImage>
                      </label>
                    </div>
                    <div className="btn_func emoji flex items-center">
                      <div className="btn_emoji flex justify-end">
                        <BsEmojiSmile
                          onClick={() => emojiToggle()}
                        ></BsEmojiSmile>
                      </div>
                      {emojiState && <EmojiPicker />}
                    </div>
                  </div>
                </div>
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
                      <label htmlFor="btn_upload_file_post flex grid">
                        <BsCardImage></BsCardImage>
                      </label>
                    </div>
                    <div className="btn_func emoji flex items-center">
                      <div className="btn_emoji flex justify-end">
                        <BsEmojiSmile
                          onClick={() => emojiToggle()}
                        ></BsEmojiSmile>
                      </div>
                      {emojiState && <EmojiPicker />}
                    </div>
                  </div>
                  <div className="right_tool">
                    <div className="btn_submit_container">
                      <button className="btn_submit">
                        <IoMdSend className="text-blue-500"></IoMdSend>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="comment_area">
            <CommentUser></CommentUser>
          </div>
        </div>
      </div>
    </div>
  );
};
