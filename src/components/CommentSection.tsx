import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreContext';

interface CommentSectionProps {
  recipeId: string | number;
}

const CommentSection: React.FC<CommentSectionProps> = observer(({ recipeId }) => {
  const { commentStore, authStore } = useStores();
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    commentStore.fetchCommentsByRecipeId(recipeId);

    return () => {
      commentStore.clearComments();
    };
  }, [recipeId, commentStore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    try {
      await commentStore.createComment({
        recipe_id: recipeId,
        user_id: authStore.currentUser!.id,
        text: commentText
      });
      setCommentText('');
      setShowModal(false);
    } catch (error) {
      // Ошибка обработана в store
    }
  };

  const handleDelete = async (commentId: string | number) => {
    if (window.confirm('Удалить комментарий?')) {
      try {
        await commentStore.deleteComment(commentId);
      } catch (error) {
        // Ошибка обработана в store
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Комментарии ({commentStore.comments.length})</h4>
        <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
          Добавить комментарий
        </Button>
      </div>

      {commentStore.error && (
        <Alert variant="danger">{commentStore.error}</Alert>
      )}

      {commentStore.isLoading ? (
        <div className="text-center py-3">
          <Spinner animation="border" size="sm" />
        </div>
      ) : commentStore.comments.length === 0 ? (
        <Alert variant="info">
          Пока нет комментариев. Будьте первым!
        </Alert>
      ) : (
        <div>
          {commentStore.comments.map((comment) => (
            <Card key={comment.id} className="mb-2">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <Card.Text>{comment.text}</Card.Text>
                    <small className="text-muted">
                      {formatDate(comment.created_at)}
                    </small>
                  </div>
                  {authStore.currentUser?.id === comment.user_id && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(comment.id)}
                    >
                      Удалить
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Модалка добавления комментария */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить комментарий</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Ваш комментарий</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Напишите комментарий..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!commentText.trim() || commentStore.isLoading}
          >
            {commentStore.isLoading ? 'Отправка...' : 'Отправить'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default CommentSection;
