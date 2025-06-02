import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserFriendList,
  getUserRecommendList,
  getOutgoingFriendRequest,
  getFriendRequest,
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
    <div className="min-h-screen w-full overflow-x-hidden bg-base-100">
      <div className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Friends Section Header */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-base-content truncate">
                Your Friends
              </h2>
            </div>
            <div className="flex-shrink-0">
              <Link 
                to="/notification" 
                className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto text-xs sm:text-sm"
              >
                Friend Requests
              </Link>
            </div>
          </div>

          {/* Friends List */}
          <div className="w-full">
            {loadFriendList ? (
              <div className="flex justify-center py-8 sm:py-12">
                <span className="loading loading-spinner loading-md sm:loading-lg" />
              </div>
            ) : userFriendList.length === 0 ? (
              <NoFriendsFound />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full">
                {userFriendList
                  .filter(friend => friend && friend._id)
                  .map((friend) => (
                    <div key={friend._id} className="w-full min-w-0">
                      <FriendCard friend={friend} />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recommendations Section */}
          <section className="w-full">
            <div className="mb-4 sm:mb-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-base-content">
                  Meet New People
                </h2>
                <p className="text-sm sm:text-base text-base-content/70 max-w-2xl">
                  Discover passionate language learners from around the world
                </p>
              </div>
            </div>

            {loadRecommendations ? (
              <div className="flex justify-center py-8 sm:py-12">
                <span className="loading loading-spinner loading-md sm:loading-lg" />
              </div>
            ) : userRecommendations.length === 0 ? (
              <div className="card bg-base-200 w-full">
                <div className="card-body p-4 sm:p-6 text-center">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">
                    No recommendations available
                  </h3>
                  <p className="text-base-content/70 text-sm sm:text-base">
                    Try again later for new recommendations
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 w-full">
                {userRecommendations
                  .filter(user => user && user._id)
                  .map((user) => {
                    const hasRequestSent = sendingRequestId.has(user._id);
                    const isAlreadyFriend = friendIds.has(user._id);
                    const hasIncomingRequest = Array.isArray(allFriendRequests.incomingReqs)
                      ? allFriendRequests.incomingReqs.some(
                          req => req.sender && req.sender._id === user._id
                        )
                      : false;

                    return (
                      <div
                        key={user._id}
                        className="card bg-base-200 hover:shadow-lg transition-all duration-300 w-full min-w-0"
                      >
                        <div className="card-body p-3 sm:p-4 space-y-3">
                          {/* User Info */}
                          <div className="flex items-center gap-3 w-full min-w-0">
                            <div className="avatar flex-shrink-0">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full">
                                <img
                                  src={user.profilePic}
                                  alt={user.fullName}
                                  className="w-full h-full object-cover rounded-full"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base sm:text-lg text-base-content truncate">
                                {user.fullName}
                              </h3>
                              {user.location && (
                                <div className="flex items-center text-xs sm:text-sm text-base-content/70 mt-1">
                                  <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                  <span className="truncate">{user.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Language Badges */}
                          <div className="flex flex-col gap-2 w-full">
                            <div className="badge badge-secondary gap-1 w-full justify-center text-xs py-2">
                              <span className="hidden xs:inline">Native:</span>
                              <span className="xs:hidden">N:</span>
                              <span className="flex-shrink-0">{getLanguageFlag(user.nativeLanguage)}</span>
                              <span className="truncate text-xs">
                                {capitalizeFirstLetter(user.nativeLanguage)}
                              </span>
                            </div>
                            <div className="badge badge-outline gap-1 w-full justify-center text-xs py-2">
                              <span className="hidden xs:inline">Learning:</span>
                              <span className="xs:hidden">L:</span>
                              <span className="flex-shrink-0">{getLanguageFlag(user.learningLanguage)}</span>
                              <span className="truncate text-xs">
                                {capitalizeFirstLetter(user.learningLanguage)}
                              </span>
                            </div>
                          </div>

                          {/* Bio */}
                          {user.bio && (
                            <div className="w-full">
                              <p className="text-xs sm:text-sm text-base-content/70 line-clamp-2 break-words">
                                {user.bio}
                              </p>
                            </div>
                          )}

                          {/* Action Button */}
                          <div className="w-full pt-2">
                            {hasIncomingRequest ? (
                              <div className="btn btn-info btn-sm w-full text-xs">
                                Check Friend Requests
                              </div>
                            ) : (
                              <button
                                className={`btn btn-sm w-full text-xs ${
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
                                <div className="flex items-center justify-center gap-1 w-full min-w-0">
                                  {isAlreadyFriend ? (
                                    <>
                                      <CheckCircleIcon className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Friends</span>
                                    </>
                                  ) : hasRequestSent ? (
                                    <>
                                      <CheckCircleIcon className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Sent</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserPlusIcon className="w-3 h-3 flex-shrink-0" />
                                      <span className="truncate">Add Friend</span>
                                    </>
                                  )}
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;