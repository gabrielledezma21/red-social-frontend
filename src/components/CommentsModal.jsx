import { Modal, Button } from 'react-bootstrap';
import Comment from './Comment';
import FormComment from './FormComment';
import { getFunctions } from './functions';
import { useEffect, useState, useCallback } from 'react';

const CommentsModal = ({ show, onHide, post, user, currentUser, onCommentsChanged }) => {
  const [commentsWithUsers, setCommentsWithUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsersForComments = useCallback(async () => {
    if (post?.comments && post.comments.length > 0) {
      try {
        setLoading(true);

        const commentsWithUserData = await Promise.all(
          post.comments.map(async (comment) => {
            const userId = typeof comment.userId === 'string'
              ? comment.userId
              : comment.userId?._id;

            if (!userId) {
              console.error("Formato de userId no reconocido:", comment.userId);
              return comment;
            }

            const userData = await getFunctions.getUserByObjectId(userId);
            return { ...comment, user: userData };
          })
        );

        setCommentsWithUsers(commentsWithUserData);
      } catch (error) {
        console.error("Error fetching users for comments:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setCommentsWithUsers([]);
      setLoading(false);
    }
  }, [post]);

  useEffect(() => {
    if (show) {
      fetchUsersForComments();
    }
  }, [show, fetchUsersForComments]);

  const handleCommentCreated = (createdComment) => {
    if (!createdComment?._id) {
      fetchUsersForComments();
      return;
    }

    setCommentsWithUsers((previousComments) => {
      if (previousComments.some((comment) => comment._id === createdComment._id)) {
        return previousComments;
      }
      const nextComments = [...previousComments, { ...createdComment, user: currentUser }];
      onCommentsChanged?.(nextComments.map(({ user: _user, ...comment }) => comment));
      return nextComments;
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>
          Comentarios del post de @{user?.nickName || 'Usuario'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-secondary text-light" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        <div className="mb-4">
          <h6 className="text-light mb-3">
            Comentarios ({commentsWithUsers.length}):
          </h6>

          {loading ? (
            <div className="text-center p-4">
              <p>Cargando comentarios...</p>
            </div>
          ) : commentsWithUsers.length > 0 ? (
            commentsWithUsers.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                user={comment.user}
                onDeleted={(commentId) => {
                  setCommentsWithUsers((previousComments) => {
                    const nextComments = previousComments.filter((item) => item._id !== commentId);
                    onCommentsChanged?.(nextComments.map(({ user: _user, ...comment }) => comment));
                    return nextComments;
                  });
                }}
                onUpdated={(updatedComment) => {
                  setCommentsWithUsers((previousComments) => {
                    const nextComments = previousComments.map((item) =>
                      item._id === updatedComment._id
                        ? { ...item, ...updatedComment, user: item.user }
                        : item
                    );
                    onCommentsChanged?.(nextComments.map(({ user: _user, ...comment }) => comment));
                    return nextComments;
                  });
                }}
              />
            ))
          ) : (
            <div className="text-center p-4">
              <p>No hay comentarios aún</p>
              <small className="text-muted">¡Sé el primero en comentar!</small>
            </div>
          )}
        </div>

        <div className="mt-3 p-3 border border-light rounded bg-dark">
          <h6 className="text-light mb-3">Agregar un comentario:</h6>
          <FormComment
            post={post}
            user={currentUser}
            onCommentCreated={handleCommentCreated}
          />
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-dark">
        <Button variant="danger" type="button" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsModal;
