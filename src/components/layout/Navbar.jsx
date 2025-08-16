import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-white text-2xl font-bold">☁️ Cloudivito</Link>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                    <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
