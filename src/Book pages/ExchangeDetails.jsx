import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ExchangeDetails = () => {
    const { requestId } = useParams();
    const [request, setRequest] = useState(null);
    const [owner, setOwner] = useState(null);
    const [bookTitle, setBookTitle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const reqDoc = await getDoc(doc(db, 'requests', requestId));
            if (!reqDoc.exists()) return;
            const reqData = reqDoc.data();
            setRequest(reqData);

            if (reqData.bookOwnerUid) {
                const ownerDoc = await getDoc(doc(db, 'users', reqData.bookOwnerUid));
                if (ownerDoc.exists()) setOwner(ownerDoc.data());
            }

            if (reqData.bookId) {
                const bookDoc = await getDoc(doc(db, 'books', reqData.bookId));
                if (bookDoc.exists()) setBookTitle(bookDoc.data().title);
            }
        };

        fetchData();
    }, [requestId]);

    if (!request || !owner) return <p>Loading...</p>;

    return (
        <div>
            <p><strong>Status:</strong> {request.status}</p>
            <p><strong>Book Name:</strong> {bookTitle}</p>
            <h3>Owner Info:</h3>
            <p><strong>Owner Name:</strong> {owner.name}</p>
            <p><strong>Owner Phone:</strong> {owner.phone}</p>
        </div>
    );
};

export default ExchangeDetails;
