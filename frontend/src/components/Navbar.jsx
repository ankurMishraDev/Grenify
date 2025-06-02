import React from 'react'
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { BellIcon, HomeIcon, LogOutIcon, MessageSquareTextIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import useLogout from '../hooks/useLogout';

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
    const handleLogout = useLogout().mutate;

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-14 sm:h-16 flex items-center">
            <div className="container mx-auto px-2 sm:px-4 lg:px-8">
                <div className="flex items-center justify-between w-full gap-2 sm:gap-3">
                    {/* LOGO - ONLY IN THE CHAT PAGE */}
                    {isChatPage && (
                        <div className="flex-1 min-w-0">
                            <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5">
                                <MessageSquareTextIcon className="size-6 sm:size-8 md:size-9 text-primary flex-shrink-0" />
                                <span className="text-lg sm:text-2xl md:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider truncate">
                                    Grenify
                                </span>
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto">
                      <Link to={"/"} className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                      <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-base-content opacity-70" />
                      </Link>
                        <Link to={"/notification"}>
                            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                                <BellIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-base-content opacity-70" />
                            </button>
                        </Link>

                        <ThemeSelector />

                        <div className="avatar">
                            <div className="w-7 sm:w-8 md:w-9 rounded-full">
                                <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
                            </div>
                        </div>

                        {/* Logout button */}
                        <button className="btn btn-ghost btn-circle btn-sm sm:btn-md" onClick={handleLogout}>
                            <LogOutIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-base-content opacity-70" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar