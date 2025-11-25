import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean;
  onDelete?: (id: string | number) => void;
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
    <Card className="recipe-card fade-in">
      <Card.Img 
        variant="top" 
        src={recipe.image_url} 
        alt={recipe.title}
      />
      <Card.Body className="recipe-card-body">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">
          {recipe.description.length > 100 
            ? `${recipe.description.substring(0, 100)}...` 
            : recipe.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <small style={{ color: '#95A5A6' }}>{formatDate(recipe.created_at)}</small>
        </div>
        <div className="d-flex gap-2 mt-3">
          <Link 
            to={`/recipe/${recipe.id}`} 
            className="btn btn-custom-primary btn-sm flex-grow-1"
            style={{ textDecoration: 'none' }}
          >
            Подробнее
          </Link>
          {showActions && (
            <>
              <Link 
                to={`/recipe/edit/${recipe.id}`} 
                className="btn btn-outline-warning btn-sm"
              >
                ✏️
              </Link>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete && onDelete(recipe.id)}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;
