import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchFilter, setSearchFilter] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchFilter.trim() === "") return;

        navigate(`/home/allbook?filter=${searchFilter}`);

    };

    return (
        <div className='header'>
            <div className="left-header">
                <h2>Book-Swap</h2>
            </div>

            <div className="right-header">

                <div className="search">
                    <input
                        type='text'
                        placeholder='enter author/book name'
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />

                    <button onClick={handleSearch}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24" height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </div>

                <div className="my-requests hb">
                    <Link to="/home/myrequests" className='links'>My Requests</Link>
                </div>

                <div className="request-link-book hb">
                    <Link to="/home/requestbook" className='links'>Requests</Link>
                </div>

                <div className="all-book hb">
                    <Link to="/home/allbook" className='links'>All Books</Link>
                </div>

                <div className="my-book hb">
                    <Link to="/home/mybook" className='links'>My Books</Link>
                </div>

                <div className="add-book hb">
                    <Link to="/home/addbook" className='links'>Add Books</Link>
                </div>

                <div className="profile hb">
                    <Link to="/home/profile" className='links'>Profile</Link>
                </div>

            </div>
        </div>
    );
};

export default Header;
