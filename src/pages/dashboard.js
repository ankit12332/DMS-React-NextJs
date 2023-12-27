import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check for the token
    const token = Cookies.get('token');

    // Redirect to login if there is no token
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center px-4" style={{ height: 'calc(100vh - 100px)' }}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl text-center text-gray-800 text-opacity-30 font-bold">
        Welcome to Document Management Software
      </h1>
    </div>
  )
}
