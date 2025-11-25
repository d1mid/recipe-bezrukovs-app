import React, { useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStores } from '../stores/StoreContext';
import CommentSection from '../components/CommentSection';  // Добавьте импорт

type RecipeParams = {
  id: string;
};

const RecipeDetailPage: React.FC = observer(() => {
  const { id } = useParams<RecipeParams>();
  const navigate = useNavigate();
  const { recipeStore, authStore } = useStores();

  useEffect(() => {
    if (id) {
      recipeStore.fetchRecipeById(id);
    }

    return () => {
      recipeStore.clearCurrentRecipe();
    };
  }, [id, recipeStore]);

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этот рецепт?')) {
      try {
        await recipeStore.deleteRecipe(id!);
        navigate('/');
      } catch (error) {
        // Ошибка обработана в store
      }
    }
  };

  if (recipeStore.isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  if (recipeStore.error || !recipeStore.currentRecipe) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {recipeStore.error || 'Рецепт не найден'}
        </Alert>
        <Link to="/" className="btn btn-primary">
          Вернуться на главную
        </Link>
      </Container>
    );
  }

  const recipe = recipeStore.currentRecipe;
  const isOwner = authStore.currentUser?.id === recipe.userId; 


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container className="mt-4">
      <Link to="/" className="btn btn-outline-secondary mb-3">
        ← Назад к рецептам
      </Link>

      <Card>
        <Card.Img 
          variant="top" 
          src={recipe.image_url} 
          alt={recipe.title}
          style={{ height: '400px', objectFit: 'cover' }}
        />
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <Card.Title as="h2">{recipe.title}</Card.Title>
              <Card.Text className="text-muted">
                <small>Опубликовано: {formatDate(recipe.created_at)}</small>
              </Card.Text>
            </div>
            {isOwner && (
              <div className="d-flex gap-2">
                <Link 
                  to={`/recipe/edit/${recipe.id}`}
                  className="btn btn-warning btn-sm"
                >
                  Редактировать
                </Link>
                <Button 
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                >
                  Удалить
                </Button>
              </div>
            )}
          </div>

          <Card.Text as="div">
            <h4>Описание</h4>
            <p>{recipe.description}</p>
          </Card.Text>

          <Card.Text as="div" className="mt-4">
            <h4>Ингредиенты</h4>
            <ul>
              {recipe.ingredients.split(',').map((ingredient: string, index: number) => (
                <li key={index}>{ingredient.trim()}</li>
              ))}
            </ul>
          </Card.Text>

          {/* Добавляем секцию комментариев */}
          <CommentSection recipeId={recipe.id} />
        </Card.Body>
      </Card>
    </Container>
  );
});

export default RecipeDetailPage;
