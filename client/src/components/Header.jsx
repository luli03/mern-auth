
import {FaSignInAlt, FaSignOutAlt} from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Nav, Container, Navbar, NavDropdown, Badge } from 'react-bootstrap';
import { useSignoutMutation } from '../slices/userApiSplice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ signoutA ] = useSignoutMutation();

  const logoutHandler = async (e) => {
      try {
        await logout().unwrap();
        dispatch(u)
      } catch (err) {
          console.log(err?.data?.message || err.error);
      }
  }
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <LinkContainer to='/'>
            <Navbar.Brand>MERN AUTH</Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className='ms-auto'>
            { userInfo ? (
              <>
                <Navbar.Text>
                  Signed in as: 
                </Navbar.Text>

                <NavDropdown title={'@'+userInfo.username} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>
                          Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                    </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to='/signin'>
                    <Nav.Link>
                        <FaSignInAlt /> Sign In
                    </Nav.Link>
                </LinkContainer>

                <LinkContainer to='/signup'>
                    <Nav.Link>
                        <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;