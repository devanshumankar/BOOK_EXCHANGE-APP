import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc
} from "firebase/firestore";
import "./admindash.css"

const AdminDashboard = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [approvedUsersCount, setApprovedUsersCount] = useState(0);
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pendingRef = query(
                    collection(db, "users"),
                    where("role", "==", "pending")
                );
                const pendingSnap = await getDocs(pendingRef);
                setPendingUsers(
                    pendingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
                );

                const approvedRef = query(
                    collection(db, "users"),
                    where("role", "==", "user")
                );
                const approvedSnap = await getDocs(approvedRef);
                setApprovedUsersCount(approvedSnap.size);

                const booksRef = collection(db, "books");
                const booksSnap = await getDocs(booksRef);
                setTotalBooks(booksSnap.size);

                setLoading(false);
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const approveUser = async (uid) => {
        try {
            await updateDoc(doc(db, "users", uid), {
                role: "user",
                isApproved: true,
            });
            setPendingUsers((prev) => prev.filter((u) => u.id !== uid));
            alert("User approved successfully!");
        } catch (err) {
            console.log(err);
        }
    };

    const rejectUser = async (uid) => {
        try {
            await updateDoc(doc(db, "users", uid), {
                role: "rejected",
                isApproved: false,
            });
            setPendingUsers((prev) => prev.filter((u) => u.id !== uid));
            alert("User rejected.");
        } catch (err) {
            console.log(err);
        }
    };

    const makeAdmin = async (uid) => {
        try {
            await updateDoc(doc(db, "users", uid), {
                role: "admin",
                isApproved: true,
            });
            setPendingUsers((prev) => prev.filter((u) => u.id !== uid));
            alert("User promoted to Admin successfully!");
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) return <p>Loading Admin Dashboard...</p>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Pending Requests</h3>
                    <p>{pendingUsers.length}</p>
                </div>

                <div className="stat-card">
                    <h3>Approved Users</h3>
                    <p>{approvedUsersCount}</p>
                </div>

                <div className="stat-card">
                    <h3>Total Books</h3>
                    <p>{totalBooks}</p>
                </div>
            </div>

            <h2>Pending User Requests</h2>

            {pendingUsers.length === 0 ? (
                <p>No pending user registrations.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map((u) => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.phone}</td>
                                <td>
                                    <button onClick={() => approveUser(u.id)}>Approve</button>
                                    <button
                                        style={{ marginLeft: "10px", background: "red", color: "white" }}
                                        onClick={() => rejectUser(u.id)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        style={{ marginLeft: "10px", background: "green", color: "white" }}
                                        onClick={() => makeAdmin(u.id)}
                                    >
                                        Make Admin
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
