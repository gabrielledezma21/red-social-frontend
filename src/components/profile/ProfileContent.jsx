import { Alert } from 'react-bootstrap';
import Post from '../Post';
import Comment from '../Comment';
import FormPost from '../FormPost';
import { getFunctions } from '../functions';
import { useCallback, useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const ProfileContent = ({ activeTab }) => {
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProfileData = useCallback(async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const [userPosts, userComments] = await Promise.all([
        getFunctions.getPostsFromUser(user._id),
        getFunctions.getCommentsFromUser(user._id),
      ]);
      setPosts(userPosts);
      setComments(userComments);
    } catch (error) {
      console.error("Error al cargar el perfil:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    loadProfileData();

    const events = [
      "recargar-profile-content",
      "nuevo-post-eliminado",
      "nuevo-post-creado",
      "nuevo-comment-eliminado",
      "comentarios-actualizados",
      "nuevo-comentario-creado",
    ];
    events.forEach((eventName) => window.addEventListener(eventName, loadProfileData));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, loadProfileData));
    };
  }, [loadProfileData]);

  if (!user) return null;
  if (loading && posts.length === 0 && comments.length === 0) {
    return <Alert variant="info">Cargando perfil...</Alert>;
  }

  if (activeTab === 'posts') {
    return (
      <>
        <FormPost user={user} />
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              user={user}
              post={post}
              tags={post.tags || []}
            />
          ))
        ) : (
          <Alert variant="info">No hay posts</Alert>
        )}
      </>
    );
  }

  return comments.length > 0 ? (
    comments.map((comment) => (
      <Comment
        user={user}
        comment={comment}
        key={comment._id}
        onDeleted={(commentId) =>
          setComments((current) => current.filter((item) => item._id !== commentId))
        }
        onUpdated={(updatedComment) =>
          setComments((current) =>
            current.map((item) => item._id === updatedComment._id ? updatedComment : item)
          )
        }
      />
    ))
  ) : (
    <Alert variant="info">No hay comentarios</Alert>
  );
};

export default ProfileContent;
