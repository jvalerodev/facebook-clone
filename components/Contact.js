import Image from 'next/image';

const Contact = ({ src, name }) => {
    return (
        <div className="flex items-center space-x-3 relative hover:bg-gray-200 p-2 cursor-pointer rounded-xl">
            <Image className="rounded-full" src={src} width={50} height={50} layout="fixed" objectFit="cover" />
            <p>{name}</p>
            <div className="absolute bottom-2 left-7 bg-green-500 h-3 w-3 rounded-full"></div>
        </div>
    );
};

export default Contact;