import React, { useEffect, useState } from 'react';
import UserBook from './UserBook';
import { auth, db } from '../firebase/firebase';
import { collection, deleteDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { updateDoc } from "firebase/firestore";


const MyBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchingData = async () => {
            try {

                const currentUser = auth.currentUser;
                if (!currentUser) {
                    setBooks([]);
                    setLoading(false);
                    return;
                }

                const uid = currentUser.uid
                const dbRef = collection(db, "books");
                const dbSnap = await getDocs(dbRef);

                const bookList = dbSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                })).filter((book) => book.uid == uid)
                setBooks(bookList);
                setLoading(false);

            }
            catch (error) {
                console.log(error);
                setLoading(false)
            }
        }
        fetchingData();
    }, [])

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "books", id));
            const reqRef = collection(db, "requests");
            const q = query(reqRef, where("bookId", "==", id));
            const snap = await getDocs(q);
            for (const docSnap of snap.docs) {
                await deleteDoc(doc(db, "requests", docSnap.id));
            }

            setBooks(prev => prev.filter(book => book.id !== id));
        }
        catch (err) {
            console.log(err)
        }
    }
    const handleEdit = async (id, oldName, oldAuthor) => {
        const newName = prompt("Enter new book name:", oldName);
        if (!newName) return;

        const newAuthor = prompt("Enter new author name:", oldAuthor);
        if (!newAuthor) return;

        try {
            const ref = doc(db, "books", id);

            await updateDoc(ref, {
                title: newName,
                author: newAuthor,
            });

            setBooks(prev =>
                prev.map(book =>
                    book.id === id
                        ? { ...book, title: newName, author: newAuthor }
                        : book
                )
            );
            const reqRef = collection(db, "requests");
            const q = query(reqRef, where("bookId", "==", id));
            const snap = await getDocs(q);

            for (const docSnap of snap.docs) {
                await updateDoc(doc(db, "requests", docSnap.id), {
                    title: newName,
                    author: newAuthor
                });
            }

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="my-book-container">
            <h1>Your Books</h1>
            <div className='my-books'>
                {loading ? (
                    <p>Loading your books...</p>
                ) : books.length === 0 ? (
                    <p>You haven't added any books yet.</p>
                ) : (
                    books.map((book) => <UserBook key={book.id} book={book} onDelete={handleDelete}
                        onEdit={() => handleEdit(book.id, book.title, book.author)}
                    />)
                )}
            </div>
        </div>
    );
}

export default MyBook;
