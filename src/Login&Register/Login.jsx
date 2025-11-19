import React, { useState } from 'react';

import "./css/Login.css"
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
const Login = () => {
    const [email, setEmail] = useState("");

    const [pass, setPass] = useState("")

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            if (auth.currentUser) {
                await signOut(auth);
            }
            const userCred = await signInWithEmailAndPassword(auth, email.trim(), pass);
            const uid = userCred.user.uid;

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                setError("User Not Exists/valid");
                await signOut(auth);
                return;
            }

            const userData = docSnap.data();
            if (userData.role === "admin") {
                navigate("/admindash");
                return;
            }

            if (!userData.isApproved) {
                setError("Your account is not approved yet. Please wait for admin approval.");
                await signOut(auth);
                return;
            }
            if (userData.role === "user") {
                navigate("/home/allbook");
                return;
            }
            setError("Invalid role. Contact admin.");
            await signOut(auth);

        }
        catch (err) {
            if (err.code == "auth/user-not-found") {
                setError("Please Register first")
            }
            else if (err.code == "auth/wrong-password") {
                setError("please enter correct password")
            }
            else if (err.code == "auth/invalid-email") {
                setError("please enter valid email")
            }
            else if (err.code === "auth/missing-password") {
                setError("Password is required");
            }
            else if (err.code === "auth/missing-email") {
                setError("Email is required");
            }
            else {
                setError("Login failed. Please try again.");
            }
        }

    }
    return (
        <div className='page'>
            <div className="container">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="mailcontainer">
                        <input type='text' id='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>

                    <div className="passwordcontainer">
                        <input type='password' id='password' placeholder='Enter password' value={pass} onChange={(e) => setPass(e.target.value)}></input>
                    </div>
                    {error && (
                        <p className="error-msg">{error}</p>
                    )}
                    <div className="sign-in-btn">
                        <button type='submit'>Login</button>
                    </div>

                    <div className="text-container">
                        <p>Dont have an Account?<Link to="/register" className='reg-link'>Register</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
