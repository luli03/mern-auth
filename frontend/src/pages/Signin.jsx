import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";

import { useDispatch, useSelector} from 'react-redux';
import { useSigninMutation } from '../redux/services/authApi';
import { setCredentials } from '../redux/features/authSlice';

const Signin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const eToken = '$2a$10$IVR1YXppFqVnfWOJoha97u5.39hjOmbU32rjKnpCNrz4y0Q5Js/mG';
    const eEmail = 'joedjoven02@gmail.com';
    const path = `/verify-email?email=${eEmail}&verificationToken=${eToken}`;

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const [signin, {isLoading}] = useSigninMutation();

    const {userInfo} =useSelector((state) => state.auth);

    useEffect(() => {
        if(userInfo){
            navigate('/');
        }
    }, [navigate, userInfo])


    const submitHandler = (e) => {
        e.preventDefault();

        signin({user, password})
        .unwrap()
        .then((payload) => {
            dispatch(setCredentials({...payload}))
        })
        .catch((error) => console.log(error.msg))

    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId="user">
                    <Form.Label>Username/Email Address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Username or Email"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant="primary" className="mt-5">
                    Sign In
                </Button>

                <Row className="py-3">
                    <Col>
                        New User?
                        <Link to='/signup'>Click here to Sign up.</Link>
                    </Col>

                </Row>
                
                <Link to={path}>sample click from email</Link>
            </Form>
        </FormContainer>
    )
}

export default Signin