import { useParams, useNavigate, Link } from 'react-router-dom';
import {  Button, Container, Row } from "react-bootstrap";

import { useVerifyEmailMutation } from '../redux/services/authApi';

const VerifyEmail = () => {
    const navigate = useNavigate();
    
    const { email, verificationToken } = useParams();

    const [verifyEmail, {isLoading}] = useVerifyEmailMutation();

    const onClickVerifyEmail = (e) => {
        e.preventDefault();
        
        verifyEmail({verificationToken, email})
        .unwrap()
        .then((payload) => {
            navigate('/signin')
        })
        .catch((error) => console.log(error?.data?.msg || error.msg))
    }

    return (
        <Container>
            <Row className='my-2'>
                Click the button to verify your account
            </Row>
            <Button className="" onClick={onClickVerifyEmail}>
                Verify Email
            </Button>
        </Container>
    )
}

export default VerifyEmail