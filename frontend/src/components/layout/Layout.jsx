import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";

const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
        isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

function Layout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-gray-900 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <span className="text-white text-xl font-bold">Task Flow</span>
                        <div className="flex gap-1">
                            <NavLink to="/tasks" className={navLinkClass}>
                                Tasks
                            </NavLink>
                            <NavLink to="/categories" className={navLinkClass}>
                                Categories
                            </NavLink>
                            <NavLink to="/settings/profile" className={navLinkClass}>
                                Settings
                            </NavLink>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-gray-300 hover:text-white transition cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;