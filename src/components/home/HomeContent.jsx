import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import Post from '../Post';
import { getFunctions } from '../functions';

const HomeContent = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPostsAndUsers = async () => {
            try {
                const posts = await getFunctions.getAllPosts();
                const postsWithUsers = await Promise.all(
                    posts.map(async (post) => {
                        const user = await getFunctions.getUserByObjectId(post.userId);
                        return { ...post, userId: user };
                    })
                );
                postsWithUsers.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setPosts(postsWithUsers);
            } catch (error) {
                console.error("Error fetching posts and users:", error);
            }
        };

        fetchPostsAndUsers();

        const handler = () => fetchPostsAndUsers();
        window.addEventListener("nuevo-post-creado", handler);
        window.addEventListener("nuevo-comentario-creado", handler);
        window.addEventListener("comentarios-actualizados", handler);

        return () => {
            window.removeEventListener("nuevo-post-creado", handler);
            window.removeEventListener("nuevo-comentario-creado", handler);
            window.removeEventListener("comentarios-actualizados", handler);
        };
    }, []);

    return (
        <>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        key={post._id}
                        user={post.userId}
                        post={post}
                    />
                ))
            ) : (
                <Alert variant="info">No hay posts</Alert>
            )}
        </>
    );
};

export default HomeContent;
