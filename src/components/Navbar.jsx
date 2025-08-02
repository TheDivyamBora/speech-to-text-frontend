import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      await signOut();
      navigate("/");
    } catch (err) {
      setError("An unexpected error occurred."); // Catch unexpected errors
    }
  };
  console.log(session);


  
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 border-gray-100 shadow-sm'>
        <div className="w-full container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 md:h-20 h-16">
            <div >
            {/* logo */}
            <div className="flex items-center gap-0 cursor-pointer">                         
                <div  className="w-10 h-10 bg-blue-600 rounded-full opacity-75 hover:opacity-100 transition-opacity"></div>
                <div  className="w-10 h-10 bg-red-500 rounded-full -ml-2 hover:opacity-75 transition-opacity"></div>
                <h1 className="font-bold text-indigo-800 text-2xl">
                    AURA SPEECH
                    <h4 className="font-medium text-indigo-500 text-xs" >Welcome, {session?.user?.email}</h4>
                </h1>     
            </div>    
        </div>   


          {/* Mobile menu  button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='md:hidden p-2'>
             { 
                 isMenuOpen ? <HiX className='size-6'/> : <HiMenu  className='size-6'/> 
            } 
            </button>


            {/*desktop nav items */}
            

            {/* Signout button */}
            <button onClick={handleSignOut}
          className="hidden md:block bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100 ">Sign Out</button>

        </div>

        
            {/* Mobile Menu Items */}
            {
              isMenuOpen && (
            <div className="md-hidden bg-white border-t border-gray-100 py-4">
              
              
               <button onClick={handleSignOut}
               className="w-f bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100 ">Sign Out</button>

              </div>
            
              )
            }



    </nav>
  );
};

export default Navbar;