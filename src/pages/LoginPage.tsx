import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useStores } from '../stores/StoreContext';

const LoginPage: React.FC = observer(() => {
  const { authStore } = useStores();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await authStore.login({ email, password });
      navigate('/'); 
    } catch (error) {
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4">Вход в систему</h2>
              
              {authStore.error && (
                <Alert variant="danger">{authStore.error}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Введите email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={authStore.isLoading}
                >
                  {authStore.isLoading ? 'Вход...' : 'Войти'}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p>
                  Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
              </div>

              <div className="mt-3">
                <Alert variant="info">
                  <small>
                    <strong>Тестовые данные:</strong><br/>
                    Email: admin@example.com<br/>
                    Пароль: admin123
                  </small>
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
});

export default LoginPage;
