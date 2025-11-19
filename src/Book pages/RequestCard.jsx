import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const RequestCard = ({ request }) => {
    const [status, setStatus] = useState(request.status || "pending");
    const [offeredBook, setOfferedBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOfferedBook = async () => {
            if (!request.offeredBookId) return;
            const docRef = doc(db, "books", request.offeredBookId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setOfferedBook({ id: docSnap.id, ...docSnap.data() });
        };
        fetchOfferedBook();
    }, [request.offeredBookId]);

    if (status === "rejected") return null;

    const handleReject = async () => {
        try {
            await updateDoc(doc(db, "books", request.bookId), { status: "available" });
            if (offeredBook) await updateDoc(doc(db, "books", offeredBook.id), { status: "available" });
            await updateDoc(doc(db, "requests", request.id), { status: "rejected" });
            setStatus("rejected");
        } catch (err) {
            console.error(err);
        }
    };

    const handleAccept = async () => {
        try {

            await updateDoc(doc(db, "books", request.bookId), { status: "exchanged" });
            if (offeredBook) await updateDoc(doc(db, "books", offeredBook.id), { status: "exchanged" });

            await updateDoc(doc(db, "requests", request.id), { status: "accepted" });
            setStatus("accepted");

            navigate(`/home/exchange/${request.id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="book-card">
            <h3>Requested Book:</h3>
            <div className="book-image">
                <img src={request.image} alt="requested-book" />
            </div>
            <p><strong>Title:</strong> {request.title}</p>
            <p><strong>Author:</strong> {request.author}</p>
            <p><strong>Condition:</strong> {request.condition}</p>

            {offeredBook && (
                <>
                    <h3>Offered Book:</h3>
                    <div className="book-image">
                        <img src={offeredBook.image} alt="offered-book" />
                    </div>
                    <p><strong>Title:</strong> {offeredBook.title}</p>
                    <p><strong>Author:</strong> {offeredBook.author}</p>
                    <p><strong>Condition:</strong> {offeredBook.condition}</p>
                </>
            )}

            {status === "pending" && (
                <div className="request-page-buttons">
                    <button className='rej' onClick={handleReject}>Reject</button>
                    <button className='acc' onClick={handleAccept}>Accept</button>
                </div>
            )}
        </div>
    );
};

export default RequestCard;
