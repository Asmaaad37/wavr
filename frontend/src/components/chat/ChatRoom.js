import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";
import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket, onlineUsersId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [incomingMessage, setIncomingMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMessagesOfChatRoom(currentChat._id);
      setMessages(res || []);
    };
    fetchData();
  }, [currentChat._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      setIncomingMessage({ senderId: data.senderId, message: data.message });
    });
  }, [socket]);

  useEffect(() => {
    incomingMessage && setMessages((prev) => [...prev, incomingMessage]);
  }, [incomingMessage]);

  const handleFormSubmit = async (message) => {
    const receiverId = currentChat.members.find((m) => m !== currentUser.uid);
    socket.current.emit("sendMessage", { senderId: currentUser.uid, receiverId, message });
    const res = await sendMessage({ chatRoomId: currentChat._id, sender: currentUser.uid, message });
    setMessages((prev) => [...prev, res]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 bg-white border-b border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/50 flex-shrink-0 flex items-center gap-2">
        <button
          className="md:hidden p-1.5 -ml-1 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
          onClick={onBack}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <Contact chatRoom={currentChat} currentUser={currentUser} onlineUsersId={onlineUsersId} header={true} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50 dark:bg-slate-900">
        {messages.map((message, index) => (
          <div key={index} ref={scrollRef}>
            <Message message={message} self={currentUser.uid} />
          </div>
        ))}
      </div>

      <div className="flex-shrink-0">
        <ChatForm handleFormSubmit={handleFormSubmit} />
      </div>
    </div>
  );
}