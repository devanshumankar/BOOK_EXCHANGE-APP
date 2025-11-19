import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const RequestBook = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setRequests([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "requests"),
            where("bookOwnerUid", "==", currentUser.uid),
            where("status", "==", "pending")
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const booklist = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(booklist);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className='request-book'>
            <h1>Pending Requests for Your Books</h1>
            <div className="req-book-card">
                {loading ? (
                    <p>Loading requests...</p>
                ) : requests.length === 0 ? (
                    <p>No requests available.</p>
                ) : (
                    requests.map(req => <RequestCard key={req.id} request={req} />)
                )}
            </div>
        </div>
    );
};

export default RequestBook;
