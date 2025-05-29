import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserFriendList,
  getUserRecommendList,
  getOutgoingFriendRequest,
} from "../lib/api";
import React, { useEffect, useState } from "react";
import { sendFriendRequest } from "../lib/api";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { getLanguageFlag } from "../components/FriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [sendingRequestId, setSendingRequestId] = useState(new Set());
  
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
    
  const { data: userFriendList = [], isLoading: loadFriendList } = useQuery({
    queryKey: ["userFriendList"],
    queryFn: getUserFriendList,
  });
  
  const { data: userRecommendations = [], isLoading: loadRecommendations } =
    useQuery({
      queryKey: ["userRecommendList"],
      queryFn: getUserRecommendList,
    });

  const { data: outgoingFriendRequest = [] } = useQuery({
    queryKey: ["outgoingFriendRequest"],
    queryFn: getOutgoingFriendRequest,
  });
  
  const { mutate: sentReqsMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequest"] }),
  });

  // Fix: Update sendingRequestId when outgoingFriendRequest changes
  useEffect(() => {
    if (outgoingFriendRequest && outgoingFriendRequest.length > 0) {
      // console.log("Outgoing Friend Requests:", outgoingFriendRequest);
      const outgoingIds = new Set(
        outgoingFriendRequest.map(request => request.recipient._id)
      );
      // console.log(outgoingIds)
      setSendingRequestId(outgoingIds);
    } else {
      setSendingRequestId(new Set());
    }
  }, [outgoingFriendRequest]); // Proper dependency

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            Friend Requests
          </Link>
        </div>
        
        {loadFriendList ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : userFriendList.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userFriendList.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet New Peoples
                </h2>
                <p className="opacity-70">
                  Unfold the possibilities of having fun with passionate people
                  around the world
                </p>
              </div>
            </div>
          </div>

          {loadRecommendations ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : userRecommendations.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-base-content opacity-70">
                Try again later for new recommendations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userRecommendations.map((user) => {
                const hasRequestSent = sendingRequestId.has(user._id);
                return (
                  <div
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    key={user.id}
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-24 rounded-full">
                          <img 
                            src={user.profilePic} 
                            alt={user.fullName} 
                            className="w-24 h-24 object-cover rounded-full" 
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-2xl">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-sm opacity-70 mt-2">
                              <MapPinIcon className="size-4 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="badge badge-secondary font-bold text-base">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalizeFirstLetter(user.nativeLanguage)}
                        </span>
                        <span className="badge font-bold text-base">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning:{" "}
                          {capitalizeFirstLetter(user.learningLanguage)}
                        </span>
                      </div>
                      
                      {user.bio && (
                        <p className="text-base opacity-70">{user.bio}</p>
                      )}
                      
                      <button
                        className={`btn w-full mt-2 ${
                          hasRequestSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => {
                          sentReqsMutation(user._id);
                          // Optimistically update the UI
                          setSendingRequestId(prev => new Set([...prev, user._id]));
                        }}
                        disabled={isPending || hasRequestSent}
                      >
                        {hasRequestSent ? (
                          <>
                            <CheckCircleIcon className="size-5 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-5 mr-2" />
                            Add Friend
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;