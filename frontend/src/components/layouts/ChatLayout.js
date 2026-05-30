import { useEffect, useRef, useState } from "react";
import {
  getAllUsers,
  getChatRooms,
  initiateSocketConnection,
} from "../../services/ChatService";
import { useAuth } from "../../contexts/AuthContext";
import ChatRoom from "../chat/ChatRoom";
import Welcome from "../chat/Welcome";
import AllUsers from "../chat/AllUsers";
import SearchUsers from "../chat/SearchUsers";

export default function ChatLayout() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [onlineUsersId, setOnlineUsersId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isContact, setIsContact] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const socket = useRef();
  const { currentUser } = useAuth();

  // Keep the backend awake on Render's free tier by pinging the health
  // check every 4 minutes while the user has the app open.
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    const ping = () => fetch(`${backendUrl}/`).catch(() => {});
    ping();
    const interval = setInterval(ping, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getSocket = async () => {
      const res = await initiateSocketConnection();
      socket.current = res;
      socket.current.emit("addUser", currentUser.uid);
      socket.current.on("getUsers", (users) => {
        setOnlineUsersId(users.map((u) => u[0]));
      });
    };
    getSocket();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getChatRooms(currentUser.uid);
      setChatRooms(res || []);
    };
    fetchData();
  }, [currentUser.uid]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllUsers();
      setUsers(res || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredUsers(users);
    setFilteredRooms(chatRooms);
  }, [users, chatRooms]);

  useEffect(() => {
    if (isContact) setFilteredUsers([]);
    else setFilteredRooms([]);
  }, [isContact]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setShowChat(true);
  };

  const handleSearch = (newSearchQuery) => {
    setSearchQuery(newSearchQuery);
    const searchedUsers = users.filter((user) =>
      user.displayName.toLowerCase().includes(newSearchQuery.toLowerCase())
    );
    const searchedUsersId = searchedUsers.map((u) => u.uid);
    if (chatRooms.length !== 0) {
      chatRooms.forEach((chatRoom) => {
        const isUserContact = chatRoom.members.some(
          (e) => e !== currentUser.uid && searchedUsersId.includes(e)
        );
        setIsContact(isUserContact);
        isUserContact ? setFilteredRooms([chatRoom]) : setFilteredUsers(searchedUsers);
      });
    } else {
      setFilteredUsers(searchedUsers);
    }
  };

  return (
    <div className="h-[calc(100vh-57px)] flex bg-gray-50 dark:bg-slate-900">
      {/* Sidebar — full-width on mobile, fixed 320px on md+ */}
      <div className={`flex-col flex-shrink-0 bg-white border-r border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/50 w-full md:w-80 ${showChat ? "hidden md:flex" : "flex"}`}>
        <SearchUsers handleSearch={handleSearch} />
        <AllUsers
          users={searchQuery !== "" ? filteredUsers : users}
          chatRooms={searchQuery !== "" ? filteredRooms : chatRooms}
          setChatRooms={setChatRooms}
          onlineUsersId={onlineUsersId}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
      </div>

      {/* Chat area — hidden on mobile until a chat is selected */}
      <div className={`flex-1 flex-col ${showChat ? "flex" : "hidden md:flex"}`}>
        {currentChat ? (
          <ChatRoom
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
            onlineUsersId={onlineUsersId}
            onBack={() => setShowChat(false)}
          />
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  );
}