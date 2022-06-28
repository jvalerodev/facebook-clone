import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import { CameraIcon, VideoCameraIcon } from '@heroicons/react/solid';
import { useRef, useState } from 'react';
import { db, storage, collection, addDoc, serverTimestamp, ref, uploadString, getDownloadURL, doc, updateDoc } from '../firebase';

const InputBox = () => {
    const { data: session } = useSession();
    const inputRef = useRef();
    const filepickerRef = useRef();
    const [imageToPost, setImageToPost] = useState(null);

    const sendPost = async e => {
        e.preventDefault();

        if (!inputRef.current.value) return;

        addDoc(collection(db, 'posts'), {
            message: inputRef.current.value,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            timestamp: serverTimestamp()
        }).then(document => {
            if (imageToPost) {
                const storageRef = ref(storage, `posts/${document.id}`);

                uploadString(storageRef, imageToPost, 'data_url')
                    .then(snapshot => {
                        getDownloadURL(snapshot.ref).then(url => {
                            const docRef = doc(db, 'posts', document.id);
                            updateDoc(docRef, { postImage: url });
                        });
                    })
                    .catch(error => console.error(error));

                removeImage();
            }
        }).catch(error => console.error(error));

        inputRef.current.value = '';
    };

    const addImageToPost = e => {
        if (!e.target.files[0]) return;

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = readerEvent => {
            setImageToPost(readerEvent.target.result);
        };
    };

    const removeImage = () => {
        setImageToPost(null);
        filepickerRef.current.value = null;
    };

    return (
        <div className="bg-white rounded-2xl p-2 shadow-md text-gray-500 font-medium mt-6">
            <div className="flex items-center space-x-4 p-4">
                <Image className="rounded-full" src={session.user.image} width={40} height={40} layout="fixed" />

                <form className="flex flex-1">
                    <input
                        className="rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none"
                        type="text"
                        ref={inputRef}
                        placeholder={`What's on your mind, ${session.user.name}?`}
                    />

                    <button hidden type="submit" onClick={sendPost}>Submit</button>
                </form>

                {imageToPost && (
                    <div onClick={removeImage} className="flex flex-col cursor-pointer filter hover:brightness-110 transition duration-150 transform hover:scale-105">
                        <img className="h-10 object-contain" src={imageToPost} alt="" />
                        <p className="text-xs text-red-500 text-center">Remove</p>
                    </div>
                )}
            </div>

            <div className="flex justify-evenly p-3 border-t space-x-1">
                <div className="input-icon">
                    <VideoCameraIcon className="h-7 text-red-500" />
                    <p className="text-xs sm:text-sm xl:text-base">Live Video</p>
                </div>
                <div className="input-icon" onClick={() => filepickerRef.current.click()}>
                    <CameraIcon className="h-7 text-green-400" />
                    <p className="text-xs sm:text-sm xl:text-base">Photo/Video</p>
                    <input
                        type="file"
                        onChange={addImageToPost}
                        ref={filepickerRef}
                        hidden
                    />
                </div>
                <div className="input-icon">
                    <EmojiHappyIcon className="h-7 text-yellow-500" />
                    <p className="text-xs sm:text-sm xl:text-base">Feeling/Activity</p>
                </div>
            </div>
        </div>
    );
};

export default InputBox;