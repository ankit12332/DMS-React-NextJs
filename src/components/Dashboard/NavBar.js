import { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
    // Clear all cookies
    Object.keys(Cookies.get()).forEach(function(cookieName) {
      Cookies.remove(cookieName);
    });

    // Redirect to the login page
    router.push('/login');
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, []);

  return (
    <header className="bg-gray-800 text-white">
      <div className="flex justify-between items-center mx-auto py-4 px-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
            <FaUser className="text-md" />
            <span className='ml-2 mr-1'>Username</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
              <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">My Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100" onClick={handleLogout}>Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}