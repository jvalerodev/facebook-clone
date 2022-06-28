import Head from 'next/head';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

const Login = () => {
    return (
        <div className="h-screen bg-gray-100">
            <Head>
                <title>Facebook - Login</title>
            </Head>
            <div className="grid place-items-center">
                <Image src="https://links.papareact.com/t4i" height={400} width={400} objectFit="contain" />

                <h1 onClick={signIn} className="bg-blue-500 p-5 text-white rounded-full text-center cursor-pointer">Login with Facebook</h1>
            </div>
        </div>
    );
};

export default Login;