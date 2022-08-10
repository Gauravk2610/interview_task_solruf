import React, { useEffect, useRef } from 'react'
import { signOut } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useRecoilState } from 'recoil';
import { userState } from '../atoms/userAtom';
import Header from '../components/Header';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { PacmanLoader } from 'react-spinners';

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };   

const Home = () => {

    // recoil state for user data 
    const [user, setUser] = useRecoilState(userState);

    // user data from Firebase 
    const [userDetails, setUserDetails] = React.useState({})
    // loading state
    const [loading, setLoading] = React.useState(false)
    // user Image  
    const [userImg, setUserImg] = React.useState(null)

    // extension type of the image
    const extensionType = ['png', 'jpg', 'jpeg']
    // ref for user img
    const imgRef = useRef(null)

    const handleChange = (event) => {
        setUserDetails({...userDetails, [event.target.name]: event.target.value})
    }

    const addImage = (e) => {
        console.log(e.target.files[0])
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
        }

        reader.onload = (readerEvent) => {
            setUserImg(readerEvent.target.result)
        }
    }


    const handleSubmit = async(event) => {
        event.preventDefault()
        setLoading(true)
        await updateDoc(doc(db, 'users', userDetails.id), {
            firstname: userDetails.firstname,
            lastname: userDetails.lastname,
        })
        if (userImg) {
            // console.log(docRef)
            const imageRef = ref(storage, `users/${userDetails.id}/image`)
            
            await uploadString(imageRef, userImg, "data_url").then(async snapshot => {
                console.log("I am here")
                const downloadURL = await getDownloadURL(imageRef)
                console.log(downloadURL)
    
                await updateDoc(doc(db, 'users', userDetails.id), {
                    photoURL: downloadURL
                })
            })
        }

        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        onSnapshot(doc(db, "users", user.uid), (snapshot) => {
            setUserDetails(snapshot.data())
        })
        setLoading(false)
    }, [])

  return (
    <div>
        {
            loading &&
            <div className='w-full h-screen flex items-center justify-between fixed backdrop-blur-[2px]'>
                <PacmanLoader speedMultiplier={2} loading={loading} size={40} color={"#fff"} cssOverride={override} />
            </div>
        }
        <Header />
        <div className='max-w-lg h-fit mx-auto bg-[#181818] bg-opacity-90 px-6 py-6 rounded-md sdx'>
            <form onSubmit={handleSubmit}>
                {/* First name LastName & Image */}
                <div className='w-36 h-36 mx-auto'>
                    <input 
                    ref={imgRef} 
                    type="file" 
                    hidden
                    onChange={addImage} 
                    accept='image/x-png,image/gif,image/jpeg, image/jpg' />
                    <img 
                    onClick={() => imgRef.current.click()}
                    src={userDetails.photoURL || userImg ? userImg || userDetails.photoURL : 'https://i1.wp.com/wilcity.com/wp-content/uploads/2020/06/115-1150152_default-profile-picture-avatar-png-green.jpg?fit=820%2C860&ssl=1'} 
                    alt='Profile' className='w-full h-full object-cover rounded-full' />
                </div>
                {/* First Name */}
                <div className='flex flex-col my-2'>
                    <label 
                    className='text-gray-400 text-lg font-semibold mb-2' 
                    htmlFor="firstname">
                        First Name
                    </label>
                    <input 
                    className="w-full py-2 px-3 border border-gray-700 border-opacity-40 rounded-md bg-inherit" 
                    type="text" 
                    id="firstname" 
                    name="firstname"
                    onChange={handleChange} 
                    value={userDetails?.firstname} />
                </div>
                {/* Last Name */}
                <div className='flex flex-col my-2'>
                <label 
                    className='text-gray-400 text-lg font-semibold mb-2' 
                    htmlFor="lastname">
                        Last Name
                    </label>
                    <input 
                    className="w-full py-2 px-3 border border-gray-700 border-opacity-40 rounded-md bg-inherit" 
                    type="text" 
                    id="lastname" 
                    name="lastname" 
                    onChange={handleChange} 
                    value={userDetails?.lastname} />
                </div>
                {/* Email */}
                <div className='flex flex-col my-2'>
                <label 
                    className='text-gray-400 text-lg font-semibold mb-2' 
                    htmlFor="email">
                        Email
                    </label>
                    <input 
                    className="w-full py-2 px-3 border border-gray-700 border-opacity-40 rounded-md bg-inherit" 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={user?.email} 
                    disabled
                    readOnly
                    />
                </div>
                {/* Submit Button */}
                <div className='flex justify-center my-2 mt-8'>
                    <button className='w-full btn py-2 px-3 border border-gray-500 bg-white rounded-md bg-inherit sdx font-semibold' type='submit'>Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Home