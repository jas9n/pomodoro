import Form from '../components/Form'
import '../styles/Home.css'
import { Link } from 'react-router-dom'


function Login() {
    return (
        <div className='home'>
            <Link className="home-button" to="/">Back</Link>
            <Form route="/api/token/" method="login" />
        </div>
    )
}

export default Login