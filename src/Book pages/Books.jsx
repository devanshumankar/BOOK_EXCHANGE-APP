import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebase';
import { addDoc, collection, updateDoc, doc, query, where, getDocs } from 'firebase/firestore';
import "./books.css";

const Books = ({ book }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [myBooks, setMyBooks] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentUser) return;
        const fetchMyBooks = async () => {
            const q = query(
                collection(db, "books"),
                where("uid", "==", currentUser.uid),
                where("status", "==", "available") 
            );
            const snapshot = await getDocs(q);
            setMyBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchMyBooks();
    }, [currentUser]);

    const handleRequest = async () => {
        if (!currentUser) return alert("You must be logged in to request a book");
        if (book.uid === currentUser.uid) return alert("You cannot request your own book!");
        if (!selectedBookId) return alert("Select one of your books to offer.");

        try {
            await addDoc(collection(db, "requests"), {
                bookId: book.id,
                title: book.title,
                author: book.author,
                image: book.image,
                condition: book.condition,
                requestedBy: currentUser.uid,
                requestedAt: new Date(),
                bookOwnerUid: book.uid,
                offeredBookId: selectedBookId,
                status: "pending"
            });

            await updateDoc(doc(db, "books", book.id), { status: "pending" });
            await updateDoc(doc(db, "books", selectedBookId), { status: "pending" });

            alert("Request sent successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to send request");
        }
    };

    if (book.status !== "available") return null;

    return (
        <div className="book-card">
            <div className="book-image">
                <img src={book.image} alt="book-img" />
            </div>
            <div className="book-title"><h3>Title :</h3><p>{book.title}</p></div>
            <div className="book-author"><h3>Author :</h3><p>{book.author}</p></div>
            <div className="condition"><h3>Condition:</h3><p>{book.condition}</p></div>

            {currentUser?.uid !== book.uid && myBooks.length > 0 && (
                <div className="request">
                    <select
                        value={selectedBookId}
                        onChange={(e) => setSelectedBookId(e.target.value)}
                    >
                        <option value="">Select your book to offer</option>
                        {myBooks.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                    </select>
                    <button onClick={handleRequest}>Request Exchange</button>
                </div>
            )}

            {currentUser?.uid === book.uid && <p>This is your book</p>}
            {currentUser?.uid !== book.uid && myBooks.length === 0 && (
                <p>You don't have any available books to offer.</p>
            )}
        </div>
    );
};

export default Books;
