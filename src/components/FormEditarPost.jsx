import { useState, useContext } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { API_URL, apiEndpoints } from '../config/api';
import { UserContext } from '../context/UserContext';
import FormTag from './FormTag'; 

const FormEditarPost = ({ post, onCancel, onSuccess }) => {
    const { user } = useContext(UserContext);
    const [content, setContent] = useState(post.content);
    const [imagenes, setImagenes] = useState([]);
    const [editandoImagenes, setEditandoImagenes] = useState(post.imagenes || []);
    const [showTagModal, setShowTagModal] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagenes(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Actualizar el contenido del post
            const resPost = await fetch(`${API_URL}${apiEndpoints.posts}/${post._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            });

            if (!resPost.ok) throw new Error("Error al actualizar el post");

            // 2. Reemplazar imágenes anteriores solo cuando se seleccionaron nuevas
            if (imagenes.length > 0) {
            for (const img of editandoImagenes) {
                if (!img?._id) continue;

                const resDelete = await fetch(`${API_URL}${apiEndpoints.archives}/${img._id}`, {
                    method: "DELETE",
                });

                if (!resDelete.ok) {
                    console.warn("No se pudo eliminar imagen:", img._id);
                }
            }

            // 3. Subir las nuevas imágenes
            if (imagenes.length > 0) {
                const formData = new FormData();
                formData.append("postId", post._id);
                imagenes.forEach((img) => {
                    formData.append("imagenes", img);
                });

                const resUpload = await fetch(`${API_URL}${apiEndpoints.archives}`, {
                    method: "POST",
                    body: formData,
                });

                if (!resUpload.ok) throw new Error("Error al subir nuevas imágenes");
            }
            }

            alert("¡Post actualizado exitosamente!");
            
            // EVENTOS PARA ACTUALIZAR TODAS LAS VISTAS
            window.dispatchEvent(new Event("nuevo-post-creado"));
            window.dispatchEvent(new Event("post-actualizado"));
            window.dispatchEvent(new Event("perfil-actualizado"));
            
            onSuccess?.();
        } catch (error) {
            console.error("Error al editar post:", error);
            alert("Error al editar el post: " + error.message);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Card 
                    className="mx-auto my-5 bg-dark text-light" 
                    style={{ 
                        minHeight: '20rem', 
                        width: '100%',
                        maxWidth: 'min(90vw, 800px)'
                    }}
                >
                    {/* Header responsive con Flexbox */}
                    <Card.Header className="text-light p-3">
                        <div 
                            className="d-flex"
                            style={{
                                flexDirection: window.innerWidth < 576 ? 'column' : 'row',
                                justifyContent: 'space-between',
                                alignItems: window.innerWidth < 576 ? 'stretch' : 'center',
                                gap: window.innerWidth < 576 ? '1rem' : '0.5rem'
                            }}
                        >
                            {/* Título del usuario */}
                            <Card.Title 
                                className="mb-0"
                                style={{ 
                                    fontSize: window.innerWidth < 576 ? '1rem' : '1.1rem'
                                }}
                            >
                                Editando post de @{user.nickName}
                            </Card.Title>
                            
                            {/* Botones de acción */}
                            <div 
                                className="d-flex gap-2"
                                style={{
                                    flexDirection: window.innerWidth < 576 ? 'column' : 'row'
                                }}
                            >
                                <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    onClick={onCancel}
                                    style={{
                                        width: window.innerWidth < 576 ? '100%' : 'auto'
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button 
                                    size="sm" 
                                    type="submit" 
                                    variant="primary"
                                    style={{
                                        width: window.innerWidth < 576 ? '100%' : 'auto'
                                    }}
                                >
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </Card.Header>

                    {/* Body con Flexbox */}
                    <Card.Body className="p-3">
                        <div className="d-flex flex-column gap-3">
                            {/* Textarea del contenido */}
                            <Form.Group controlId="editContent">
                                <Form.Label className="text-light">Contenido del post:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={window.innerWidth < 768 ? 3 : 4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="bg-dark text-light border-secondary"
                                    placeholder="Escribe el contenido de tu post..."
                                    style={{ 
                                        resize: 'vertical',
                                        minHeight: '80px'
                                    }}
                                />
                            </Form.Group>

                            {/* Input de imágenes */}
                            <Form.Group controlId="editImages">
                                <Form.Label className="text-light">Reemplazar imágenes:</Form.Label>
                                <Form.Control
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="bg-dark text-light border-secondary"
                                />
                                <Form.Text className="text-muted">
                                    Se reemplazarán hasta {editandoImagenes.length} imágenes existentes.
                                </Form.Text>
                                {imagenes.length > 0 && (
                                    <Form.Text className="text-success d-block">
                                        {imagenes.length} nueva(s) imagen(es) seleccionada(s)
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </div>
                    </Card.Body>

                    {/* Footer con botón de tags */}
                    <Card.Footer className="bg-dark border-secondary p-3">
                        <div className="d-flex justify-content-center">
                            <Button 
                                variant="outline-success" 
                                size="sm" 
                                onClick={() => setShowTagModal(true)}
                            >
                                <i className="bi bi-tags me-2"></i>
                                Editar Tags
                            </Button>
                        </div>
                    </Card.Footer>
                </Card>
            </Form>

            {/* Modal de Tags */}
            <FormTag
                show={showTagModal}
                onHide={() => setShowTagModal(false)}
                user={user}
                post={post}
            />
        </>
    );
};

export default FormEditarPost;
