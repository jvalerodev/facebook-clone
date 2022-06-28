import Head from 'next/head';
import Header from '../components/Header';
import { getSession } from 'next-auth/react';
import Login from '../components/Login';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Widgets from '../components/Widgets';
import { db, collection, orderBy, query, getDocs } from '../firebase';

const Home = ({ session, posts }) => {
    if (!session) return <Login />;

    return (
        <div className="h-screen bg-gray-100 overflow-y-auto">
            <Head>
                <title>Facebook</title>
            </Head>

            <Header />

            <main className="flex">
                <Sidebar />
                <Feed posts={posts} />
                <Widgets />
            </main>
        </div>
    )
};

export const getServerSideProps = async context => {
    // Get the user
    const session = await getSession(context);
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);

    const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: null
    }));

    return {
        props: {
            session,
            posts
        }
    };
};

export default Home;