import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {

    // initial values for default form values
    const initialValues = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    // useState is a hook that is used to create state variables
    const [values, setValues] = React.useState(initialValues)

    // useNavigate is a hook that is used to navigate between pages
    const navigate = useNavigate()

    // auth is a variable that is used to access the firebase auth functions
    // const auth = getAuth();

    // handleChange is a function that is used to update the state variables
    const handlChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }

    // checkPassword is a function that is used to check if the password and confirm password fields match
    const checkPasswordValid = () => {
        if (values.password === values.confirmPassword) {
            var passw =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
            // var newReg = new RegExp()
            console.log(values.password.match(passw))
            if(values.password.match(passw)){
                return true;
            }
            else {
                notify('error', 'Password must be at least 8 characters long and contain at least one number and one uppercase letter')
                return false;
            }
        }
        notify('error', 'Password and Confirm Password do not match')
        return false;
    }

    // adduser is a function that is used to add a new user to the database
    const adduserData = async(user) => {
        const docRef = await setDoc(doc(db, 'users', user.uid), {
            firstname: values.firstname,
            lastname: values.lastname,
            displayName: user.displayName,
            id: user.uid,
            photoURL: user.photoURL,
            timestamp: serverTimestamp(),
            date: new Date().toDateString()
        })
    }

    // handleSubmit is a function that is used to submit the form
    const handleSubmit = (event) => {
        event.preventDefault()
        console.log(values)
        const valid = checkPasswordValid()
        if (valid) {
            createUserWithEmailAndPassword(auth, values.email, values.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                adduserData(user)
                console.log(userCredential.userName)
                console.log(user)
                navigate('/')
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                notify('error', errorMessage)
                // ..
            });
            notify('success', 'Register Successfully')
        }

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

    // notify is a function that is used to display a notification
    const notify = (type, msg) => {

        // define the options for the notification
        const options = {
            position: "top-right",
            autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            };

        // switch statement to determine the type of notification
        switch (type) {
            // if the type is success
            case 'success':                
                toast.success(msg, options)
                break;
        
            // if the type is error
            case 'error':
                toast.error(msg, options)

            // if the type is warning
            default:
                console.log(type)
                break;
        }

    }

  return (
    <div className="flex kanit">
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
          className="w-full h-full object-cover"
          src="https://born2invest.com/wp-content/uploads/2017/12/Ever-brighter-The-future-of-solar-energy.jpg"
          alt="Login"
        />
      </div>
      {/* right section */}
      <div className="mx-6 my-4 pt-12 w-full lg:w-1/2 flex justify-center ">
        {/* Width Wrapper */}
        <div className="flex flex-col w-full max-w-lg h-fit bg-[#181818] bg-opacity-90 px-6 py-6 rounded-md sdx">
          {/* logo */}
          {/* <img 
            className='w-52'
            src="https://i.ibb.co/rpxqJQB/Sol-Ruf-animated-Logo-1.png" 
            alt="logo" /> */}

          {/* login */}
          <h1 className="text-4xl font-semibold">Create new account</h1>
          {/* Welcome back */}
          <div className="my-4 text-gray-400">
            Already a Member? <Link className="text-blue-400 hover:underline" to="/">Log In</Link>
          </div>

          {/* Login Form */}
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {/* First name & Last name */}
            <div className="flex items-end md:space-x-4 flex-col md:flex-row">
                <div className="flex flex-col my-2 w-full">
                    <label className="text-gray-400 text-sm font-semibold mb-2">First name</label>
                    <input
                    className="w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit"
                    type="text"
                    name="firstname"
                    value={values.firstname}
                    onChange={handlChange}
                    placeholder="Enter your first name"
                    required
                    />
                </div>
                <div className="flex flex-col my-2 w-full">
                    <label className="text-gray-400 text-sm font-semibold mb-2">Last name</label>
                    <input
                    className="w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit"
                    type="text"
                    name="lastname"
                    value={values.lastname}
                    onChange={handlChange}
                    placeholder="Enter your last name"
                    required
                    />
                </div>
            </div>
            {/* Email */}
            <div className="flex flex-col my-2">
              <label className="text-gray-400 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                className="w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit"
                type="email"
                name="email"
                value={values.email}
                onChange={handlChange}
                placeholder="Enter your email"
                required
              />
            </div>
            {/* Password */}
            <div className="flex flex-col my-2">
              <label className="text-gray-400 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                className="w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit"
                type="password"
                name="password"
                value={values.password}
                onChange={handlChange}
                placeholder="Enter your password"
              />
            </div>
            {/* Confirm Password */}
            <div className="flex flex-col my-2">
                <label className="text-gray-400 text-sm font-semibold mb-2">
                    Confirm password
                </label>
                <input
                className="w-full py-2 px-3 border border-gray-500 rounded-md bg-inherit"
                type="password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handlChange}
                placeholder="Confirm your password"
              />
            </div>

            {/* Register Button */}
            <div className="flex justify-center my-2">
              <button
                className="w-full btn py-2 px-3 border border-gray-500 bg-white rounded-md bg-inherit sdx font-semibold"
                type="submit"
              >
                Register
              </button>
            </div>
            {/* Sign in with google */}
            <div className="flex justify-center my-2">
              <button
                onClick={signIn}
                className="flex justify-center space-x-3 bg-white w-full py-2 px-3 text-black rounded-md font-semibold "
                type="button"
              >
                <span className="text-lg">Sign up with</span>
                <span>
                  <img
                    className="w-6"
                    src="https://cdn.icon-icons.com/icons2/836/PNG/512/Google_icon-icons.com_66793.png"
                    alt=""
                  />
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
