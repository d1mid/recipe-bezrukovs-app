import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { useStores } from '../stores/StoreContext';

type RecipeParams = {
  id?: string;
};

const CreateEditRecipePage: React.FC = observer(() => {
  const { id } = useParams<RecipeParams>();
  const navigate = useNavigate();
  const { recipeStore, authStore } = useStores();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [validated, setValidated] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    // ВАЖНО: загружаем рецепт ТОЛЬКО в режиме редактирования
    if (isEditMode && id) {
      recipeStore.fetchRecipeById(id).then(() => {
        const recipe = recipeStore.currentRecipe;
        if (recipe) {
          setTitle(recipe.title);
          setDescription(recipe.description);
          setIngredients(recipe.ingredients);
          setImageUrl(recipe.image_url);
        }
      });
    }

    return () => {
      // Очищаем только в режиме редактирования
      if (isEditMode) {
        recipeStore.clearCurrentRecipe();
      }
    };
  }, [id, isEditMode, recipeStore]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      if (isEditMode && id) {
        await recipeStore.updateRecipe(id, {
          title,
          description,
          ingredients,
          image_url: imageUrl
        });
        navigate(`/recipe/${id}`);
      } else {
        const newRecipe = await recipeStore.createRecipe({
          title,
          description,
          ingredients,
          image_url: imageUrl,
          user_id: authStore.currentUser!.id
        });
        navigate(`/recipe/${newRecipe.id}`);
      }
    } catch (error) {
      // Ошибка обработана в store
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <h2 className="mb-4">
            {isEditMode ? 'Редактировать рецепт' : 'Создать новый рецепт'}
          </h2>

          {recipeStore.error && (
            <Alert variant="danger">{recipeStore.error}</Alert>
          )}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Название рецепта *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Например: Паста карбонара"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
              />
              <Form.Control.Feedback type="invalid">
                Введите название (минимум 3 символа)
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Расскажите о вашем рецепте..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                minLength={10}
              />
              <Form.Control.Feedback type="invalid">
                Введите описание (минимум 10 символов)
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ингредиенты * (через запятую)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Например: мука 500г, яйца 3шт, молоко 200мл"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Введите ингредиенты
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Перечислите ингредиенты через запятую
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL изображения *</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Введите корректный URL изображения
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Вставьте ссылку на изображение блюда (можно использовать unsplash.com)
              </Form.Text>
            </Form.Group>

            {imageUrl && (
              <div className="mb-3">
                <p className="mb-2">Предпросмотр:</p>
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={recipeStore.isLoading}
              >
                {recipeStore.isLoading 
                  ? 'Сохранение...' 
                  : isEditMode ? 'Сохранить изменения' : 'Создать рецепт'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/')}
              >
                Отмена
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
});

export default CreateEditRecipePage;
