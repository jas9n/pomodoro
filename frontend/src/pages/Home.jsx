import { useState, useEffect, useContext } from "react";
import api from '../api';
import Clock from '../components/Clock';
import Navbar from '../components/Navbar';
import { Authenticated } from '../components/AuthWrappers';
import { AuthContext } from '../contexts/AuthContext'; 
import '../styles/Home.css';

function Home() {
    const [name, setName] = useState("");
    const { isAuthorized } = useContext(AuthContext); 

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
            fetchUser(); 
        }
    }, [isAuthorized]); 

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
