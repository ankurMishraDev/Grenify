import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserFriendList,
  getUserRecommendList,
  getOutgoingFriendRequest,
  getFriendRequest, // If you use this for incoming requests
} from "../lib/api";
import React, { useEffect, useState } from "react";
import { sendFriendRequest } from "../lib/api";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { getLanguageFlag } from "../utils/minorFeature.jsx";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [sendingRequestId, setSendingRequestId] = useState(new Set());

  const capitalizeFirstLetter = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  // Queries
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

  // If you want to check for incoming requests (for "Check Friend Requests" button)
  const { data: allFriendRequests = {} } = useQuery({
    queryKey: ["notifications"],
    queryFn: getFriendRequest,
  });

  // Mutation for sending friend requests
  const { mutate: sentReqsMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequest"] });
    },
  });

  // Defensive: Build set of outgoing request recipient IDs
  useEffect(() => {
    if (Array.isArray(outgoingFriendRequest) && outgoingFriendRequest.length > 0) {
      const validRequests = outgoingFriendRequest.filter(
        request => request && request.recipient && request.recipient._id
      );
      const outgoingIds = new Set(validRequests.map(request => request.recipient._id));
      setSendingRequestId(outgoingIds);
    } else {
      setSendingRequestId(new Set());
    }
  }, [outgoingFriendRequest]);

  // Defensive: Build set of friend IDs
  const friendIds = new Set(
    Array.isArray(userFriendList)
      ? userFriendList.filter(friend => friend && friend._id).map(friend => friend._id)
      : []
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
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
            {userFriendList
              .filter(friend => friend && friend._id)
              .map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
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
              {userRecommendations
                .filter(user => user && user._id)
                .map((user) => {
                  const hasRequestSent = sendingRequestId.has(user._id);
                  const isAlreadyFriend = friendIds.has(user._id);
                  // Check if there's an incoming request from this user
                  const hasIncomingRequest = Array.isArray(allFriendRequests.incomingReqs)
                    ? allFriendRequests.incomingReqs.some(
                        req => req.sender && req.sender._id === user._id
                      )
                    : false;

                  return (
                    <div
                      key={user._id}
                      className="card bg-base-200 hover:shadow-lg transition-all duration-300"
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
                          <span className="badge badge-secondary gap-0.5 font-bold text-base">
                            Native: {getLanguageFlag(user.nativeLanguage)}
                            {capitalizeFirstLetter(user.nativeLanguage)}
                          </span>
                          <span className="badge font-bold gap-.5 text-base">
                            Learning: {getLanguageFlag(user.learningLanguage)}
                            {capitalizeFirstLetter(user.learningLanguage)}
                          </span>
                        </div>

                        {user.bio && (
                          <p className="text-base opacity-70">{user.bio}</p>
                        )}

                        {hasIncomingRequest ? (
                          <div className="btn btn-info w-full mt-2">
                            <span>Check Friend Requests</span>
                          </div>
                        ) : (
                          <button
                            className={`btn w-full mt-2 ${
                              hasRequestSent || isAlreadyFriend
                                ? "btn-disabled"
                                : "btn-primary"
                            }`}
                            onClick={() => {
                              if (!hasRequestSent && !isAlreadyFriend) {
                                sentReqsMutation(user._id);
                               
                              }
                            }}
                            disabled={isPending || hasRequestSent || isAlreadyFriend}
                          >
                            {isAlreadyFriend ? (
                              <>
                                <CheckCircleIcon className="size-5 mr-2" />
                                Already Friends
                              </>
                            ) : hasRequestSent ? (
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
                        )}
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
