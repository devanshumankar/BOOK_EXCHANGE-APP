import React, { useEffect, useState } from 'react';
import Books from './Books';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useSearchParams } from 'react-router-dom';

const AllBook = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [params] = useSearchParams();
    const filterTerm = params.get("filter")?.toLowerCase() || "";

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

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(filterTerm) ||
        book.author.toLowerCase().includes(filterTerm)
    );

    return (
        <div className='all-book-container'>
            <h1>All Available Books</h1>

            <div className='all-books'>
                {loading ? (
                    <p>Loading books...</p>
                ) : filteredBooks.length === 0 ? (
                    <p>No books found.</p>
                ) : (
                    filteredBooks.map(book => <Books key={book.id} book={book} />)
                )}
            </div>
        </div>
    );
}

export default AllBook;
