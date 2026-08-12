import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import Post from '../Post';
import { getFunctions } from '../functions';

const HomeContent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const [receivedPosts, users] = await Promise.all([
        getFunctions.getAllPosts(),
        getFunctions.getAllUsers(),
      ]);
      const usersById = new Map(users.map((user) => [user._id, user]));
      const postsWithUsers = receivedPosts
        .map((post) => ({
          ...post,
          user: usersById.get(typeof post.userId === "string" ? post.userId : post.userId?._id),
        }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setPosts(postsWithUsers);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
    const events = [
      "nuevo-post-creado",
      "nuevo-post-eliminado",
      "nuevo-comentario-creado",
      "comentarios-actualizados",
    ];
    events.forEach((eventName) => window.addEventListener(eventName, loadPosts));
    return () => events.forEach((eventName) => window.removeEventListener(eventName, loadPosts));
  }, [loadPosts]);

  if (loading && posts.length === 0) {
    return <Alert variant="info">Cargando publicaciones...</Alert>;
  }

  return posts.length > 0 ? (
    posts.map((post) => (
      <Post key={post._id} user={post.user} post={post} tags={post.tags || []} />
    ))
  ) : (
    <Alert variant="info">No hay posts</Alert>
  );
};

export default HomeContent;
