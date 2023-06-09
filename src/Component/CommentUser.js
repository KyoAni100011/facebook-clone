import { FaUserAlt } from "react-icons/fa";

export const CommentUser = (props) => {
  return (
    <div className="comment_component mb-2">
      <div className="wrapper_comment flex">
        <div className="comment_component_left">
          <div className="user_image bg-wageningen_green py-2 px-2 rounded-full">
            <FaUserAlt></FaUserAlt>
          </div>
        </div>
        <div>
          <div className="comment_component_right bg-gray-200 p-3 rounded-xl ml-2 inline-block">
            <div className="name_user_comment text-sm">{props.user_cmt}</div>
            <div className="content_comment break-all">{props.cmt}</div>
          </div>
          <div className="img_user_comment w-1/2 ml-2 rounded overflow-hidden">
            <img className="width-full" src={props.img}></img>
          </div>
        </div>
      </div>
    </div>
  );
};
