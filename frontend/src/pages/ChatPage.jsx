import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import ChatLoader from "../components/ChatLoader.jsx";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import CallButton from "../components/CallButton.jsx";

const ChatPage = () => {
  const CLIENT_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();
  
  const { data: tokenData } = useQuery({
    queryKey: ["streamUser"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initializeChat = async () => {
      if (!tokenData?.token || !authUser) return;
      try {
        const client = StreamChat.getInstance(CLIENT_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const channel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await channel.watch();
        setChatChannel(channel);
        setChatClient(client);
      } catch (error) {
        console.error("Error initializing Stream Chat client:", error);
        toast.error("Failed to initialize chat. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    initializeChat();
  }, [tokenData, authUser, targetUserId, CLIENT_API_KEY]); 

  const handleVideoCall = () => {
    if(chatChannel){
      const videoCallLink = `${window.location.origin}/call/${chatChannel.id}`;
      chatChannel.sendMessage({
        text: `Let's have a video call! Join me here: ${videoCallLink}`,
        attachments: [
          {
            type: "call",
            title: "Join Video Call",
            url: videoCallLink,
          },
        ],
      })
      toast.success("Video call link sent!");
    }
  }

  if(!chatClient || !chatChannel || loading) {
    return <ChatLoader />;
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] sm:h-[calc(100vh-72px)] md:h-[93vh] overflow-hidden">
      <Chat client={chatClient}>
        <Channel channel={chatChannel}>
          <div className="w-full h-full flex flex-col relative">
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
              <CallButton handleVideoCall={handleVideoCall}/>
            </div>
            <Window>
              <div className="w-full h-full flex flex-col">
                <div className="flex-shrink-0">
                  <ChannelHeader />
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  <MessageList />
                </div>
                <div className="flex-shrink-0">
                  <MessageInput focus/>
                </div>
              </div>
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
};

export default ChatPage;