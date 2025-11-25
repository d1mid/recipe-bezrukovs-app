import React from 'react';
import { observer } from 'mobx-react-lite';
import { Navbar, Container, Nav } from 'react-bootstrap';
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
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          🍳 RecipeBook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {authStore.isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/">
                  Главная
                </Nav.Link>
                <Nav.Link as={Link} to="/my-recipes">
                  Мои рецепты
                </Nav.Link>
                <div className="d-flex align-items-center ms-3">
                  <span className="me-3" style={{ color: '#7F8C8D', fontSize: '0.9rem' }}>
                    {authStore.currentUser?.username}
                  </span>
                  <button 
                    className="btn btn-custom-outline btn-sm"
                    onClick={handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Вход
                </Nav.Link>
                <Link to="/register" className="btn btn-custom-primary btn-sm ms-2">
                  Регистрация
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default Header;
