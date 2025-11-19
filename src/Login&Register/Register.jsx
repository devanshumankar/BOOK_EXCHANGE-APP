import React, { useRef } from 'react';
import { useState } from 'react';
import "./css/Login.css"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [email, setEmail] = useState("");

  const [pass, setPass] = useState("");

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef();
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please Enter a Name");
    if (!email.trim()) return setError("Please Enter an Email");
    if (!pass.trim()) return setError("Please Enter a Password");
    if (!phone.trim()) return setError("Please Enter Mobile Number");

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
      return setError("Enter a valid 10-digit phone number");
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const uid = userCred.user.uid
      await setDoc(doc(db, "users", uid), {
        name,
        phone,
        email,
        createdAt: new Date(),
        role: "pending",
        isApproved: false
      })
      formRef.current.reset()
      navigate("/")
    }
    catch (err) {
      if (err.code == "auth/email-already-in-use") {
        setError("Email Already in Use")
      }
      else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      }
      else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      }
      else {
        setError("Registration failed. Try again.");
      }
    }

  }
  return (
    <div className='page'>
      <div className="container">
        <form onSubmit={handleRegister} ref={formRef}>
          <h1>Register</h1>
          <div className="namecontainer">
            <input type='text' id='name' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)}></input>
          </div>

          <div className="mailcontainer">
            <input type='email' id='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
          </div>

          <div className="passwordcontainer">
            <input type='password' id='password' placeholder='Enter password' value={pass} onChange={(e) => setPass(e.target.value)}></input>
          </div>

          <div className="passwordcontainer">
            <input type='tel' id='phone' placeholder='Enter Mobile Number' value={phone} onChange={(e) => setPhone(e.target.value)}></input>
          </div>

          {error && (<p className='error-msg'>{error}</p>)}
          <div className="sign-in-btn">
            <button type='submit'>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
