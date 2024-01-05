import Layout from '@/components/Dashboard/Layout';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { Provider } from 'mobx-react';
import RootStore from '@/stores/RootStore';
import { StoreContext } from '@/stores/store-context';

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Check if the current page is 'login'
    const noLayout = router.pathname === '/login';

    // Render without layout for 'login' page, otherwise use layout
     return (
        <StoreContext.Provider value={RootStore}>
        <div>
            {noLayout ? (
                <Component {...pageProps} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </div>
        </StoreContext.Provider>
    );
}

export default MyApp;
