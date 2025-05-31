import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import useAuthUser from '../hooks/useAuthUser';
import {StreamVideo, StreamVideoClient, StreamCall, CallControls, SpeakerLayout, StreamTheme, CallingState, useCallStateHooks} from '@stream-io/video-react-sdk';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';
const CallPage = () => {
  const CLIENT_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
  const {id:callerId} = useParams();
  const [client, setClient] = useState(null);
  const [makeCall, setMakeCall] = useState(null);
  const [connecting, setConnecting] = useState(true);
  const {authUser, isLoading} = useAuthUser();

  const {data:streamToken}= useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })
  useEffect(()=>{
    const initCall = async ()=>{
      if(!streamToken || !authUser || !callerId) return;
     try {
      console.log("Initializing call with token:", streamToken);
      const user = {
        id: authUser._id,
        name: authUser.fullName,
        image: authUser.profilePic
      }
      const videoCallClient = new StreamVideoClient({
        apiKey: CLIENT_API_KEY,
        user,
        token: streamToken.token,
      })
      const call = videoCallClient.call("default", callerId);
      await call.join({create:true})
      console.log("Call initialized successfully:");
      setClient(videoCallClient);
      setMakeCall(call);
     } catch (error) {
      console.log("Error initializing call:", error);
      toast.error("Failed to initialize call. Please try again later.");
     }
     finally {
      setConnecting(false);
     }
    }
    initCall();
  },[streamToken, authUser, callerId, CLIENT_API_KEY]);
  if(isLoading || connecting){
    return <PageLoader />
  }
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className="relative">
        {client && makeCall?(
          <StreamVideo client={client}>
            <StreamCall call={makeCall}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ):(
          <div className="flex items-center justify-center h-full">
            <p>Error in initializing call. Refresh the page or try again later</p>
          </div>
        )}
      </div>
     
    </div>
  )
}

const CallContent = () => {
   const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
}
export default CallPage