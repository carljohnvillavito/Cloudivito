import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const authLinks = (
        <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user && user.username}</span>
             <Link to="/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link>
            <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );

    const guestLinks = (
        <div className="space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Sign Up
            </Link>
        </div>
    );

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">☁️ Cloudivito</Link>
                <div>
                    {user ? authLinks : guestLinks}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
