import React, { useEffect, useState } from 'react';
import Books from './Books';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const AllBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const booksRef = collection(db, "books");

        const unsubscribe = onSnapshot(booksRef, snapshot => {
            const bookList = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(book => book.status === "available"); 

            setBooks(bookList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className='all-book-container'>
            <h1>All Available Books</h1>
            <div className='all-books'>
                {loading ? (
                    <p>Loading books...</p>
                ) : books.length === 0 ? (
                    <p>No books available at the moment.</p>
                ) : (
                    books.map(book => <Books key={book.id} book={book} />)
                )}
            </div>
        </div>
    );
}

export default AllBook;
