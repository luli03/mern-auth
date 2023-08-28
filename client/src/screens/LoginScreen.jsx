import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector} from 'react-redux';
import { useSigninMutation } from '../slices/userApiSplice';
import { setCredentials } from '../slices/authSlice';

const LoginScreen = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [signin, {isLoading}] = useSigninMutation();

    const {userInfo} =useSelector((state) => state.auth);

    useEffect(() => {
        if(userInfo){
            navigate('/');
        }
    }, [navigate, userInfo])

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await signin({user, password}).unwrap();
            dispatch(setCredentials({...res}));
            navigate('/');
        } catch (err) {
            console.log(err?.data?.message || err.error());
        }
    }

    return(
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
            </Form>
        </FormContainer>
    )
}

export default LoginScreen