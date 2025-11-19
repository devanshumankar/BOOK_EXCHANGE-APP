import React from 'react';

const UserBook = ({ book, onDelete, onEdit }) => {
    return (
        <div className='user-book'>
            <div className="my-book-image">
                <img src={book.image} alt='book-image'></img>
            </div>

            <div className="my-book-title">
                <h2>Title : </h2>
                <p >{book.title}</p>
            </div>

            <div className="my-book-buttons">
                <button className='edit-btn' onClick={() => onEdit(book.id)}>Edit</button>
                <button className='delete-btn' onClick={() => onDelete(book.id)}>Delete</button>
            </div>
        </div>
    );
}

export default UserBook;
