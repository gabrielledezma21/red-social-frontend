import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { API_URL, apiEndpoints } from '../config/api';

const FormComment = ({ post, user, onCommentCreated }) => {
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedContent = content.trim();
        if (trimmedContent.length < 5 || trimmedContent.length > 500) {
            alert("El comentario debe tener entre 5 y 500 caracteres.");
            return;
        }

        if (!post?._id || !user?._id) {
            alert("Tu sesión no está disponible. Vuelve a iniciar sesión.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`${API_URL}${apiEndpoints.comments}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    postId: post._id,
                    userId: user._id,
                    content: trimmedContent
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const backendMessage = Array.isArray(errorData?.error)
                    ? errorData.error.join(". ")
                    : errorData?.error || errorData?.message;
                throw new Error(backendMessage || "Error al crear el comentario");
            }

            const responseBody = await response.json();
            const comentarioCreado = responseBody?.comment || responseBody;

            if (!comentarioCreado?._id) {
                throw new Error("El servidor no devolvió el comentario creado.");
            }

            setContent("");
            onCommentCreated?.(comentarioCreado);
            window.dispatchEvent(new CustomEvent("nuevo-comentario-creado", {
                detail: { postId: post._id, comment: comentarioCreado }
            }));
        } catch (error) {
            console.error("Error al comentar:", error);
            alert(error.message || "Ocurrió un error al intentar comentar.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Control
                type="text"
                placeholder="Escribe tu comentario..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mb-3"
                maxLength={500}
                disabled={submitting}
            />
            <Button variant="primary" type="submit" disabled={submitting || content.trim().length < 5}>
                {submitting ? "Publicando..." : "Comentar"}
            </Button>
        </Form>
    );
};

export default FormComment;
