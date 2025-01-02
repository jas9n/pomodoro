import Clock from '../components/Clock'
import Navbar from '../components/Navbar'
import '../styles/Home.css'

function Home() {
    return (
        <div className="home">
            <Navbar />
            <Clock />
        </div>
    )
}

export default Home