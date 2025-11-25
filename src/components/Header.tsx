import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useStores } from '../stores/StoreContext';

const Header: React.FC = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();

  const handleLogout = () => {
    authStore.logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          🍳 Рецепты
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {authStore.isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/">Главная</Nav.Link>
                <Nav.Link as={Link} to="/my-recipes">Мои рецепты</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {authStore.isAuthenticated ? (
              <>
                <Navbar.Text className="me-3">
                  Привет, <strong>{authStore.currentUser?.username}</strong>!
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Вход</Nav.Link>
                <Nav.Link as={Link} to="/register">Регистрация</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default Header;
