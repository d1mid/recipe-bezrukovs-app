import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean;
  onDelete?: (id: string | number) => void;  // Изменили тип
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, showActions = false, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="mb-3 h-100">
      <Card.Img 
        variant="top" 
        src={recipe.image_url} 
        alt={recipe.title}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{recipe.title}</Card.Title>
        <Card.Text className="flex-grow-1">
          {recipe.description.length > 100 
            ? `${recipe.description.substring(0, 100)}...` 
            : recipe.description}
        </Card.Text>
        <Card.Text className="text-muted small">
          {formatDate(recipe.created_at)}
        </Card.Text>
        <div className="d-flex gap-2">
          <Link 
            to={`/recipe/${recipe.id}`} 
            className="btn btn-primary btn-sm flex-grow-1"
          >
            Подробнее
          </Link>
          {showActions && (
            <>
              <Link 
                to={`/recipe/edit/${recipe.id}`} 
                className="btn btn-warning btn-sm"
              >
                Редактировать
              </Link>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => onDelete && onDelete(recipe.id)}
              >
                Удалить
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
