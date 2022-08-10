import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import React, { useEffect, CSSProperties } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import { PacmanLoader } from 'react-spinners';
import { useRecoilState } from 'recoil';
import { userState } from './atoms/userAtom';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};   

function App() {

  const [user, setUser] = useRecoilState(userState);
  const [loading, setLoading] = React.useState(true);

  // useEffect is used to run a function after a component has been rendered
  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user)
      setUser({displayName: user.displayName, userName: user.displayName?.split(' ').join("").toLocaleLowerCase(),uid: user.uid, email: user.email, photoURL: user.photoURL})
    } else {
      setUser(null)
    }
    setTimeout(() => {
      setLoading(false)
    } , 1500);
  }), [])

  // if (!loading) { 
  //   return <div><PacmanLoader loa cssOverride={override} /></div>
  // }

  return (
    <div className=''>
      {loading ? <div className='flex w-[100vw] h-[100vh] justify-center items-center'>
        <PacmanLoader speedMultiplier={2} loading={loading} size={40} color={"#fff"} cssOverride={override} />
      </div> : (
        <Router>
          <Routes>
            {
              !user ? (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </> 
                
              ) : (
                <Route path="/" element={<Home user={user} />} />
              )
            }
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;
