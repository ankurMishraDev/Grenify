import React from "react";
import { getLanguageFlag } from "../utils/minorFeature.jsx";
import { Link } from "react-router";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="avatar size-10 sm:size-12 flex-shrink-0">
            <img 
              src={friend.profilePic} 
              alt={friend.fullName}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full" 
            />
          </div>
          <h3 className="font-semibold text-sm sm:text-base truncate flex-1 min-w-0">
            {friend.fullName}
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-1.5 mb-2 sm:mb-3">
          <span className="badge badge-secondary text-xs w-full sm:w-auto justify-center sm:justify-start">
            {getLanguageFlag(friend.nativeLanguage)}
            <span className="ml-1 truncate">
              Native: {friend.nativeLanguage}
            </span>
          </span>
          <span className="badge badge-secondary text-xs w-full sm:w-auto justify-center sm:justify-start">
            {getLanguageFlag(friend.learningLanguage)}
            <span className="ml-1 truncate">
              Learning: {friend.learningLanguage}
            </span>
          </span>
        </div>
        
        <Link 
          to={`/chat/${friend._id}`} 
          className="btn btn-outline w-full text-xs sm:text-sm"
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;