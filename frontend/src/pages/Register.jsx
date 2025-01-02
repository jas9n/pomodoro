import Form from '../components/Form'
import '../styles/Home.css'
import { Link } from 'react-router-dom'


function Register() {
    return (
        <div className='home'>
            <Link className="home-button" to="/">Home</Link>
            <Form route="/api/user/register/" method="register"/>
        </div>
    
    )
}

export default Register