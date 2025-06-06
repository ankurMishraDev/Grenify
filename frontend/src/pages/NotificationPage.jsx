import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriendRequest, acceptFriendRequest } from "../lib/api";
import { Link } from "react-router";
import { BellIcon, ClockIcon, MessagesSquareIcon, UserCheckIcon } from "lucide-react";
import ZeroLengthNotification from "../components/ZeroLengthNotification.jsx";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getFriendRequest,
  });
  
  const { mutate: acceptRequest, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userFriendList"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Filter out null/invalid requests and add defensive checks
  const incomingRequests = (notifications?.incomingReqs || [])
    .filter(req => req && req.sender && req.sender._id && req.sender.fullName);
    
  const outgoingRequests = (notifications?.acceptingReqs || [])
    .filter(req => req && req.recipient && req.recipient._id && req.recipient.fullName);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Incoming Friend Requests
                  <span className="badge badge-neutral ml-2">{incomingRequests.length}</span>
                </h2>
                <div className="space-y-3">
                  {incomingRequests.map((reqs) => (
                    <div
                      key={reqs._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              {reqs.sender?.profilePic ? (
                                <img
                                  src={reqs.sender.profilePic}
                                  alt={reqs.sender.fullName || "Profile Picture"}
                                  className="w-14 h-14 object-cover rounded-full"
                                />
                              ) : (
                                <div className="placeholder bg-base-300 w-14 h-14 rounded-full flex items-center justify-center">
                                  <span className="text-base-content text-xl">
                                    {reqs.sender?.fullName?.charAt(0)?.toUpperCase() || "?"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {reqs.sender?.fullName || "Unknown User"}
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {reqs.sender?.nativeLanguage && (
                                  <span className="badge badge-secondary badge-sm">
                                    Native: {reqs.sender.nativeLanguage}
                                  </span>
                                )}
                                {reqs.sender?.learningLanguage && (
                                  <span className="badge badge-secondary badge-sm">
                                    Learning: {reqs.sender.learningLanguage}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequest(reqs._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accepted Requests Section */}
            {outgoingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>
                <div className="space-y-3">
                  {outgoingRequests.map((reqs) => (
                    <div key={reqs._id} className="card bg-base-200 shadow-sm">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1 size-10 rounded-full">
                            {reqs.recipient?.profilePic ? (
                              <img 
                                src={reqs.recipient.profilePic} 
                                alt={reqs.recipient.fullName || "Profile Picture"}
                                className="size-10 object-cover rounded-full"
                              />
                            ) : (
                              <div className="placeholder bg-base-300 size-10 rounded-full flex items-center justify-center">
                                <span className="text-base-content text-sm">
                                  {reqs.recipient?.fullName?.charAt(0)?.toUpperCase() || "?"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {reqs.recipient?.fullName || "Unknown User"}
                            </h3>
                            <p className="text-sm my-1">
                              {reqs.recipient?.fullName || "Someone"} has accepted your friend request!
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-4 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success">
                            <MessagesSquareIcon className="h-4 w-4 mr-1" />
                            Connected
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
              <ZeroLengthNotification/>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;