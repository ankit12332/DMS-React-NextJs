import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';

export default function Login() {
  const [currentImage, setCurrentImage] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN , {
        username: username,
        password: password
      });

      // Set cookies after successful login
      Cookies.set('token', response.data.token);
      Cookies.set('name', response.data.user.name);
      Cookies.set('userId', response.data.user._id); // Assuming the user ID is in the response

      console.log(response.data);
      // Redirect to dashboard
      router.push('/dashboard');
      // Handle other response actions (e.g., redirect to another page)
    } catch (error) {
      console.error("Login error", error.response);
      // Handle login error (e.g., show error message)
    }
  };
    
  const images = [
    '/assets/login_dms_image.png',
    '/assets/login_dms_image2.png',
    '/assets/login_dms_image3.png'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((current) => (current + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const sliderVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 }
  };

  return (
    <div className="flex min-h-screen bg-[#D5DBE1]">
      <Head>
        <title>Login | DMS</title>
      </Head>

      <div className="m-auto bg-white p-10 rounded-lg shadow-xl flex flex-col md:flex-row max-w-4xl w-full">
        {/* Mobile View - Title and Subtitle with Blue Background */}
        <div className="md:hidden text-center p-5 bg-blue-600 text-white rounded-lg">
          <h3 className="text-2xl font-bold mb-3">
            Document Management System
          </h3>
          <p>
            Storing Documents Is Easy
          </p>
        </div>
        {/* Left Side - Login Form */}
        <motion.div 
          className="flex flex-col justify-between w-full md:w-1/2 p-5"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-left p-0 font-sans">
            <h1 className="text-gray-800 text-3xl font-medium">DMS</h1>
            <h3 className="mt-1  text-gray-700">Log in to your Account</h3>
            <p className="mt-1 mb-5 text-sm text-gray-600">Welcome back buddy!</p>
            
          </div>
          
          <form onSubmit={handleLogin}>
            {/* Username Field */}
            <div>
              <h1 className="text-gray-700 font-semibold mb-2">Username</h1>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="p-2 w-full border border-gray-300 rounded-lg mb-4 text-black"
              />
            </div>

            {/* Password Field */}
            <div>
              <h5 className="text-gray-700 font-semibold mb-2">Password</h5>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="p-2 w-full border border-gray-300 rounded-lg mb-4 text-black"
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember me
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline" style={{color:"#1F2937"}}> 
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white p-2 rounded-lg w-full"
              type="submit"
              style={{backgroundColor:"#1F2937"}}
            >
              Log in
            </motion.button>
          </form>
        </motion.div>

        {/* Right Side - Info Panel */}
        <motion.div 
          className="hidden md:block w-full md:w-1/2 p-5 text-white rounded-lg"
          style={{backgroundColor:"#1F2937"}}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-center text-2xl font-bold mb-3">
            Document Management System
          </h3>
          <p className="text-center">
            Storing Documents Is Easy
          </p>
          {/* Image for Document Management System */}
          <div className="relative mt-4 mx-auto max-w-full h-auto">
            <AnimatePresence>
              <motion.img 
                key={currentImage}
                src={images[currentImage]}
                alt="Document Management System"
                className="absolute inset-0 w-full h-auto"
                variants={sliderVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ opacity: { duration: 1.0 } }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
