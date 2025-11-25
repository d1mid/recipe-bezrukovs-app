import React, { useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { useStores } from '../stores/StoreContext';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types';  // Добавили импорт

const HomePage: React.FC = observer(() => {
  const { recipeStore } = useStores();

  useEffect(() => {
    recipeStore.fetchRecipes();
  }, [recipeStore]);

  if (recipeStore.isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Лента рецептов</h1>
        <Link to="/recipe/create" className="btn btn-success">
          + Добавить рецепт
        </Link>
      </div>

      {recipeStore.error && (
        <Alert variant="danger">{recipeStore.error}</Alert>
      )}

      {recipeStore.recipes.length === 0 ? (
        <Alert variant="info">
          <p>Пока нет рецептов. Будьте первым, кто поделится своим рецептом!</p>
          <Link to="/recipe/create" className="btn btn-primary">
            Создать рецепт
          </Link>
        </Alert>
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
