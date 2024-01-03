import Layout from '@/components/Dashboard/Layout';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Check if the current page is 'login'
    const noLayout = router.pathname === '/login';

    // Render without layout for 'login' page, otherwise use layout
     return (
        <div>
            {noLayout ? (
                <Component {...pageProps} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </div>
    );
}

export default MyApp;
