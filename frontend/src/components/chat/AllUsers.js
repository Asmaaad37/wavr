import { useState, useEffect } from "react";
import { createChatRoom } from "../../services/ChatService";
import Contact from "./Contact";
import UserLayout from "../layouts/UserLayout";

export default function AllUsers({
  users, chatRooms, setChatRooms, onlineUsersId, currentUser, changeChat,
}) {
  const [selectedChat, setSelectedChat] = useState();
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);

  useEffect(() => {
    const ids = (chatRooms || []).map((chatRoom) =>
      chatRoom.members.find((member) => member !== currentUser.uid)
    );
    setContactIds(ids);
  }, [chatRooms, currentUser.uid]);

  useEffect(() => {
    setNonContacts(
      (users || []).filter(
        (f) => f.uid !== currentUser.uid && !contactIds.includes(f.uid)
      )
    );
  }, [contactIds, users, currentUser.uid]);

  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
  };

  const handleNewChatRoom = async (user) => {
    const members = { senderId: currentUser.uid, receiverId: user.uid };
    const res = await createChatRoom(members);
    setChatRooms((prev) => [...prev, res]);
    changeChat(res);
  };

  return (
    <div className="overflow-y-auto flex-1">
      {(chatRooms || []).length > 0 && (
        <>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            Messages
          </p>
          {(chatRooms || []).map((chatRoom, index) => (
            <div
              key={index}
              onClick={() => changeCurrentChat(index, chatRoom)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 rounded-xl mx-2 mb-0.5 ${
                index === selectedChat
                  ? "bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/30"
                  : "hover:bg-gray-100 dark:hover:bg-slate-700/50"
              }`}
            >
              <Contact chatRoom={chatRoom} onlineUsersId={onlineUsersId} currentUser={currentUser} />
            </div>
          ))}
        </>
      )}

      {nonContacts.length > 0 && (
        <>
          <p className="px-4 pt-4 pb-1 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            New Chat
          </p>
          {nonContacts.map((nonContact, index) => (
            <div
              key={index}
              onClick={() => handleNewChatRoom(nonContact)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all duration-150 rounded-xl mx-2 mb-0.5"
            >
              <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}