import { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_URL, apiEndpoints } from '../config/api';

const FormEditarComment = ({ comment, user, onCancel, onSuccess }) => {
    const [content, setContent] = useState(comment.content);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedContent = content.trim();

        if (trimmedContent.length < 5 || trimmedContent.length > 500) {
            alert("El comentario debe tener entre 5 y 500 caracteres.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`${API_URL}${apiEndpoints.comments}/${comment._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: trimmedContent }),
            });

            const data = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(data?.message || "Error al actualizar el comentario");
            }

            const updatedComment = data?.comment || data;
            window.dispatchEvent(new CustomEvent("comentarios-actualizados", {
                detail: { action: "update", comment: updatedComment }
            }));
            onSuccess?.(updatedComment);
        } catch (error) {
            console.error("Error al editar comentario:", error);
            alert(error.message || "Error al editar el comentario.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Card
                className="mx-auto my-5 bg-dark text-light"
                style={{ minHeight: '16rem', width: '100%', maxWidth: 'min(90vw, 800px)' }}
            >
                <Card.Header className="text-light p-3">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3">
                        <Card.Title className="mb-0 fs-6">
                            Editando comentario de @{user?.nickName || "Usuario"}
                        </Card.Title>
                        <div className="d-flex gap-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="secondary"
                                onClick={onCancel}
                                disabled={submitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                variant="primary"
                                disabled={submitting || content.trim() === comment.content.trim()}
                            >
                                {submitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body className="p-3">
                    <Form.Group controlId={`edit-comment-${comment._id}`}>
                        <Form.Label className="text-light">Contenido del comentario:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-dark text-light border-secondary"
                            placeholder="Escribe el contenido de tu comentario..."
                            minLength={5}
                            maxLength={500}
                            disabled={submitting}
                            style={{ resize: 'vertical', minHeight: '80px' }}
                        />
                        <Form.Text className="text-secondary">
                            {content.length}/500 caracteres
                        </Form.Text>
                    </Form.Group>
                </Card.Body>
            </Card>
        </Form>
    );
};

export default FormEditarComment;
