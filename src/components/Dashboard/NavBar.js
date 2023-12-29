import { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [inactiveTime, setInactiveTime] = useState(0);
  const [name, setName] = useState(null);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    // Set name from cookies
    setName(Cookies.get('name') || 'Guest');

    // User activity event listeners
    const resetTimer = () => {
      setInactiveTime(0);
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(handleLogout, 600 * 1000); // 10 minutes
    };
    const activityEvents = ['mousemove', 'keydown', 'click'];

    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Logout timer and inactive time interval
    const interval = setInterval(() => {
      setInactiveTime(prevTime => prevTime + 1);
    }, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', resetTimer);
      clearInterval(interval);
      clearTimeout(logoutTimerRef.current);
    };
  }, [router]);

  // Automatic logout after inactivity
  useEffect(() => {
    if (inactiveTime >= 600) handleLogout(); // 10 minutes
  }, [inactiveTime]);

  const handleLogout = () => {
    Object.keys(Cookies.get()).forEach(cookieName => Cookies.remove(cookieName));
    router.push('/login');
  };

  const formatCountdown = () => {
    const totalSeconds = 600 - inactiveTime;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const closeDropdown = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <header className="bg-gray-800 text-white">
      <div className="flex justify-between items-center mx-auto py-4 px-6">
        <Link href="/dashboard" legacyBehavior>
          <h1 className="text-xl font-semibold cursor-pointer">Dashboard</h1>
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center focus:outline-none" aria-haspopup="true" aria-expanded={isDropdownOpen}>
            {inactiveTime > 0 && inactiveTime < 600 && (
              <span className="ml-2 text-sm mr-4">(Auto Logout in {formatCountdown()})</span>
            )}
            <FaUser className="text-md" />
            <span className='ml-2 mr-1'>{name || 'Loading...'}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
              <a href="#" className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">My Profile</a>
              <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
