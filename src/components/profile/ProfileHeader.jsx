import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { getFunctions } from '../functions';

const ProfileHeader = () => {
  const { user } = useContext(UserContext);
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const loadCounts = useCallback(async () => {
    if (!user?._id) return;

    try {
      const [userPosts, userComments] = await Promise.all([
        getFunctions.getPostsFromUser(user._id),
        getFunctions.getCommentsFromUser(user._id),
      ]);
      setPostsCount(userPosts.length);
      setCommentsCount(userComments.length);
    } catch (error) {
      console.error("Error cargando contadores:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    loadCounts();

    const events = [
      "recargar-profile-content",
      "nuevo-post-eliminado",
      "nuevo-post-creado",
      "nuevo-comment-eliminado",
      "comentarios-actualizados",
      "nuevo-comentario-creado",
    ];
    events.forEach((eventName) => window.addEventListener(eventName, loadCounts));

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, loadCounts));
    };
  }, [loadCounts]);

  return (
    <div className="w-100 w-md-75 w-lg-50 mx-auto mb-4 bg-dark text-light p-4 rounded text-center" style={{ minHeight: '10rem', maxWidth: '60vw' }}>
      <h2 className="fs-2">{user?.nickName}</h2>
      <div className="d-flex justify-content-around w-100 mt-3">
        <span><strong>{postsCount}</strong> Post{postsCount === 1 ? "" : "s"}</span>
        <span><strong>{commentsCount}</strong> Comentario{commentsCount === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
};

export default ProfileHeader;
