import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
// import { useSetRecoilState } from 'recoil';
// import { userState } from '../atoms/userAtom';

const Login = () => {

    const initialValues = {
        email: '',
        password: ''
    }
    const [values, setValues] = React.useState(initialValues)
    const [remeberMe, setRemeberMe] = React.useState(false)

    // const setUser = useSetRecoilState(userState)

    const handlChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    const adduserData = async(user) => {
        console.log(user, "user")
        const docRef = await setDoc(doc(db, 'users', user.uid), {
            firstname: '',
            lastname: '',
            displayName: user.displayName,
            id: user.uid,
            photoURL: user.photoURL,
            timestamp: serverTimestamp(),
            date: new Date().toDateString()
        })
      }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(values)
        signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            notify('success', 'Login Successfully')
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            notify('error', errorMessage)
        });
    }

    const signIn = () => {
        console.log(auth.currentUser)
        const provider = new GoogleAuthProvider()

        signInWithPopup(auth, provider)
            .then((result) => {
                // console.log(result)
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("user")
                adduserData(user)

                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    }
    

    const notify = (type, msg) => {

        const options = {
            position: "top-right",
            autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            };

        switch (type) {
            case 'success':                
                toast.success(msg, options)
                break;
        
            case 'error':
                toast.error(msg, options)

            default:
                console.log(type)
                break;
        }

    }

  return (
    <div className='flex kanit'>
        <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />

        {/* left Image */}
        <div className="w-1/2 xl:w-1/2 hidden lg:inline-flex h-screen">
            <img 
            className='w-full h-full object-cover'
            src="https://born2invest.com/wp-content/uploads/2017/12/Ever-brighter-The-future-of-solar-energy.jpg" 
            alt="Login" />
        </div>
        {/* right section */}
        <div className='mx-6 my-4 pt-12 w-full lg:w-1/2 flex justify-center '>
            {/* Width Wrapper */}
            <div className='flex flex-col w-full max-w-lg h-fit bg-[#181818] bg-opacity-90 px-6 py-6 rounded-md sdx'>
                {/* logo */}
                {/* <img 
                className='w-52'
                src="https://i.ibb.co/rpxqJQB/Sol-Ruf-animated-Logo-1.png" 
                alt="logo" /> */}
                
                {/* login */}
                <h1 className='text-4xl font-semibold'>Log In</h1>
                {/* Welcome back */}
                <div className='my-4 text-gray-400'>Welcome back! please enter your details </div>

                {/* Login Form */}
                <form className='flex flex-col' onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className='flex flex-col my-2'>
                        <label className='text-gray-400 text-sm font-semibold mb-2'>Email</label>
                        <input 
                        className='w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit' 
                        type='email' 
                        name='email'
                        placeholder='Enter your email' 
                        onChange={handlChange}
                        value={values.email}
                        required/>
                    </div>
                    {/* Password */}
                    <div className='flex flex-col my-2'>
                        <label className='text-gray-400 text-sm font-semibold mb-2'>Password</label>
                        <input
                        className='w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit' 
                        type='password'
                        name='password'
                        onChange={handlChange}
                        value={values.password}
                        placeholder='Enter your password' 
                        />
                    </div>

                    {/* Remeber Me & Forgot password */}
                    <div className='flex justify-between my-2'>
                        <div className='flex items-center'>
                            <input 
                            className='w-4 h-4 bg-[#181818]' 
                            type='checkbox' 
                            title='checkbox'
                            placeholder='Check box'
                            onChange={() => setRemeberMe(!remeberMe)}
                            checked={remeberMe} />
                            <label className='text-gray-400 text-md font-semibold ml-2'>Remember me</label>
                        </div>
                        <div className='flex items-center'>
                            <a className='text-gray-400 text-md font-semibold hover:underline' href='#'>Forgot password?</a>
                        </div>
                    </div>
                    {/* Dont have a account */}
                    <div className='flex justify-between my-2'>
                        <div className='flex items-center space-x-2'>
                            <label className='text-gray-400 text-md font-semibold'>Don't have an account?</label>
                            <Link className='text-blue-400  text-md font-semibold hover:underline' to={'/register'} >Register</Link>
                        </div>
                    </div>
                    {/* Login Button */}
                    <div className='flex justify-center my-2'>
                        <button 
                        className='w-full btn py-2 px-3 border border-gray-500 bg-white rounded-md bg-inherit sdx font-semibold'
                        type='submit'
                        >
                            Login
                        </button>
                    </div>
                    {/* Sign in with google */}
                    <div className='flex justify-center my-2'>
                        <button 
                        onClick={signIn}
                        className='flex justify-center space-x-3 bg-white w-full py-2 px-3 text-black rounded-md font-semibold '
                        type='button'>
                            <span className='text-lg'>
                                Sign in with 
                            </span>
                            <span>
                                <img 
                                className='w-6'
                                src="https://cdn.icon-icons.com/icons2/836/PNG/512/Google_icon-icons.com_66793.png" 
                                alt="" />
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Login