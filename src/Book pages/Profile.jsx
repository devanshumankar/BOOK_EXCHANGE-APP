import React, { useState, useEffect } from 'react';
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [totalBooks, setTotalBooks] = useState(0);
    const [successCount, setSuccessCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (!currentUser) return;

                const uid = currentUser.uid;

                // Fetch user info
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    setUserData(userSnap.data());
                }

                // Fetch total books
                const booksRef = collection(db, "books");
                const bookQuery = query(booksRef, where("uid", "==", uid));
                const bookSnap = await getDocs(bookQuery);
                setTotalBooks(bookSnap.size);

                // Fetch all accepted requests where user is owner or requester
                const requestsRef = collection(db, "requests");

                const ownerQuery = query(
                    requestsRef,
                    where("bookOwnerUid", "==", uid),
                    where("status", "==", "accepted")
                );
                const ownerSnap = await getDocs(ownerQuery);

                const requesterQuery = query(
                    requestsRef,
                    where("requestedBy", "==", uid),
                    where("status", "==", "accepted")
                );
                const requesterSnap = await getDocs(requesterQuery);

                setSuccessCount(ownerSnap.size + requesterSnap.size);

                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) return <p>Loading profile...</p>;
    if (!userData) return <p>No user data found.</p>;

    return (
        <div className="profile-page-container">
            <div className='profile-page'>
                <h1>About</h1>

                <div className="profile-full-name profile-div">
                    <h3>Full Name</h3>
                    <p>{userData.name}</p>
                </div>

                <div className="profile-email profile-div">
                    <h3>Email</h3>
                    <p>{userData.email}</p>
                </div>

                <div className="profile-phone profile-div">
                    <h3>Phone</h3>
                    <p>{userData.phone}</p>
                </div>

                <div className="profile-total-books profile-div">
                    <h3>Total Books</h3>
                    <p>{totalBooks}</p>
                </div>

                <div className="profile-success-exchange profile-div">
                    <h3>Successful Exchanges</h3>
                    <p>{successCount}</p>
                </div>

                <div className="profile-buttons">
                    <button className='edit-btn' onClick={() => navigate("/home/mybook")}>My Books</button>
                    <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
