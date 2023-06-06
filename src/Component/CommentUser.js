import { FaUserAlt } from "react-icons/fa";

export const CommentUser = () => {
  return (
    <div className="comment_component">
      <div className="wrapper_comment flex">
        <div className="comment_component_left">
          <div className="user_image bg-wageningen_green py-2 px-2 rounded-full">
            <FaUserAlt></FaUserAlt>
          </div>
        </div>
        <div className="comment_component_right bg-gray-200 p-3 rounded-xl ml-2">
          <div className="name_user_comment text-sm">Admin</div>
          <div className="content_comment break-all">
            HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello
          </div>
        </div>
      </div>
    </div>
  );
};
