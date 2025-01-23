import Form from '../components/Form'
import { Link } from 'react-router-dom'
import BackIcon from '../assets/icons/back.svg?react'


function Register() {
    return (
        <div className='bg-background h-full flex justify-center items-center'>
            <Link className="fixed top-6 right-6" to="/"><BackIcon className="fill-secondary w-8 h-8"/></Link>
            <Form route="/api/user/register/" method="register"/>    
        </div>
    
    )
}

export default Register