import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import './MyRequests.css';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const q = query(
            collection(db, "requests"),
            where("requestedBy", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const updatedRequests = await Promise.all(snapshot.docs.map(async (d) => {
                const data = { id: d.id, ...d.data() };

                if (data.bookId) {
                    const bookSnap = await getDoc(doc(db, "books", data.bookId));
                    data.book = bookSnap.exists() ? bookSnap.data() : null;
                }

                if (data.bookOwnerUid) {
                    const ownerSnap = await getDoc(doc(db, "users", data.bookOwnerUid));
                    data.owner = ownerSnap.exists() ? ownerSnap.data() : null;
                }

                return data;
            }));

            setRequests(updatedRequests);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <p className="loading">Loading your requests...</p>;

    return (
        <div className="my-requests-container">
            <h1>My Requests</h1>
            {requests.length === 0 && <p className="no-requests">No requests sent.</p>}
            {requests.map(r => (
                <div key={r.id} className="request-card">
                    <p className={`status ${r.status}`}>Status: {r.status}</p>

                    {r.book && (
                        <div className="book-info">
                            <h3>Book Requested:</h3>
                            <p><strong>Title:</strong> {r.book.title}</p>
                            <p><strong>Author:</strong> {r.book.author}</p>
                        </div>
                    )}

                    {r.status === "accepted" && r.owner && (
                        <div className="owner-info">
                            <h3>Owner Info:</h3>
                            <p><strong>Owner Name:</strong> {r.owner.name}</p>
                            <p><strong>Owner Phone:</strong> {r.owner.phone}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyRequests;
