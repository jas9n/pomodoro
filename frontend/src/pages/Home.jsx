import { useState, useEffect, useContext } from "react";
import api from '../api'; // Correctly import the api instance
import Clock from '../components/Clock';
import Navbar from '../components/Navbar';
import { Authenticated } from '../components/AuthWrappers';
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext
import '../styles/Home.css';

function Home() {
    const [name, setName] = useState("");
    const { isAuthorized } = useContext(AuthContext); // Access authentication state

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/api/user/');
                if (res.status === 200) {
                    setName(res.data.name || res.data.username);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (isAuthorized) {
            fetchUser(); // Fetch data only if authenticated
        }
    }, [isAuthorized]); // Re-run the effect if authentication state changes

    return (
        <div className="home">
            <Navbar />
            <Authenticated>
                <p>Hello, {name || 'User'}</p>
            </Authenticated>
            <Clock />
        </div>
    );
}

export default Home;
