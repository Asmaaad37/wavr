import { useState, useEffect } from "react";
import { createChatRoom, getUser } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

function ChatRoomItem({ chatRoom, isSelected, currentUser, onlineUsersId, onClick }) {
  const [contact, setContact] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const contactId = chatRoom.members?.find((m) => m !== currentUser.uid);
    getUser(contactId).then((res) => {
      setContact(res || null);
      setLoaded(true);
    });
  }, [chatRoom, currentUser]);

  if (!loaded || !contact) return null;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-150 rounded-xl mx-2 mb-0.5 ${
        isSelected
          ? "bg-indigo-50 border border-indigo-200 dark:bg-indigo-500/20 dark:border-indigo-500/30"
          : "hover:bg-gray-100 dark:hover:bg-slate-700/50"
      }`}
    >
      <UserLayout user={contact} onlineUsersId={onlineUsersId} />
    </div>
  );
}

export default function AllUsers({
  users, chatRooms, setChatRooms, onlineUsersId, currentUser, changeChat,
}) {
  const [selectedChat, setSelectedChat] = useState();
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    const ids = (chatRooms || [])
      .filter(Boolean)
      .map((chatRoom) =>
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
    if (creatingChat) return;
    setCreatingChat(true);
    try {
      const members = { senderId: currentUser.uid, receiverId: user.uid };
      const res = await createChatRoom(members);
      if (!res) return;
      setChatRooms((prev) => [...prev.filter(Boolean), res]);
      changeChat(res);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <div className="overflow-y-auto flex-1">
      {(chatRooms || []).filter(Boolean).length > 0 && (
        <>
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
            Messages
          </p>
          {(chatRooms || []).filter(Boolean).map((chatRoom, index) => (
            <ChatRoomItem
              key={chatRoom._id || index}
              chatRoom={chatRoom}
              isSelected={index === selectedChat}
              currentUser={currentUser}
              onlineUsersId={onlineUsersId}
              onClick={() => changeCurrentChat(index, chatRoom)}
            />
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
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-150 rounded-xl mx-2 mb-0.5 ${
                creatingChat
                  ? "opacity-50 cursor-wait"
                  : "cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50"
              }`}
            >
              <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}