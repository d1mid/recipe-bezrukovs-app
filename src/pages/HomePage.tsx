import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '../stores/StoreContext';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';

const HomePage: React.FC = observer(() => {
  const { recipeStore } = useStores();

  useEffect(() => {
    recipeStore.fetchRecipes();
  }, [recipeStore]);

  if (recipeStore.isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" style={{ color: '#2ECC71' }}>
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="page-title">Лента рецептов</h1>
          <p style={{ color: '#7F8C8D', fontSize: '1.1rem' }}>
            Откройте для себя вкусные рецепты от нашего сообщества
          </p>
        </div>
        <Link to="/recipe/create" className="btn btn-custom-primary" style={{ textDecoration: 'none' }}>
          + Создать рецепт
        </Link>
      </div>

      {recipeStore.error && (
        <Alert variant="danger">{recipeStore.error}</Alert>
      )}

      {recipeStore.recipes.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
          <h3 style={{ color: '#7F8C8D' }}>Пока нет рецептов</h3>
          <p style={{ color: '#95A5A6' }}>Будьте первым, кто поделится своим рецептом!</p>
          <Link to="/recipe/create" className="btn btn-custom-primary mt-3" style={{ textDecoration: 'none' }}>
            Создать первый рецепт
          </Link>
        </div>
      ) : (
        <Row>
          {recipeStore.recipes.map((recipe: Recipe) => (
            <Col key={recipe.id} md={6} lg={4} className="mb-4">
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
});

export default HomePage;
