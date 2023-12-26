import Layout from '@/components/Dashboard/Layout'
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
    <Layout />
  )
}
