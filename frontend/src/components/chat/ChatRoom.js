import { useState, useEffect, useRef } from "react";
import { getMessagesOfChatRoom, sendMessage } from "../../services/ChatService";
import Message from "./Message";
import Contact from "./Contact";
import ChatForm from "./ChatForm";

export default function ChatRoom({ currentChat, currentUser, socket, onlineUsersId }) {
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
      <div className="px-6 py-4 bg-white border-b border-gray-200 dark:bg-slate-800/50 dark:border-slate-700/50 flex-shrink-0">
        <Contact chatRoom={currentChat} currentUser={currentUser} onlineUsersId={onlineUsersId} header={true} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 bg-gray-50 dark:bg-slate-900">
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