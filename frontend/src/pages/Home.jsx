import { useState, useEffect } from "react"
import api from '../api'
import Clock from '../components/Clock'
import Navbar from '../components/Navbar'
import Auth from '../components/Auth'
import '../styles/Home.css'

function Home() {
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/api/user/'); // Adjust endpoint as needed
                if (res.status === 200) {
                    setName(res.data.name || res.data.username || 'User'); // Use name or fallback to username
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="home">
            <Navbar />
            <Auth>
                <p>
                    Hello, {name}
                </p>
            </Auth>
            <Clock />
        </div>
    )
}

export default Home