import { useContext, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { API_URL, apiEndpoints } from "../config/api";
import { UserContext } from "../context/UserContext";
import FormTag from "./FormTag";

const FormEditarPost = ({ post, onCancel, onSuccess }) => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState(post.content || "");
  const [images, setImages] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedContent = content.trim();
    if (normalizedContent.length < 5) {
      alert("El contenido debe tener al menos 5 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const postResponse = await fetch(`${API_URL}${apiEndpoints.posts}/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: normalizedContent }),
      });
      const postBody = await postResponse.json().catch(() => ({}));
      if (!postResponse.ok) throw new Error(postBody.error || "Error al actualizar el post");

      if (images.length > 0) {
        if (images.length > 5) {
          throw new Error("Podés subir hasta 5 imágenes por publicación");
        }

        const previousImages = post.imagenes || [];
        const formData = new FormData();
        formData.append("postId", post._id);
        images.forEach((image) => formData.append("imagenes", image));
        const uploadResponse = await fetch(`${API_URL}${apiEndpoints.archives}`, {
          method: "POST",
          body: formData,
        });
        if (!uploadResponse.ok) throw new Error("Error al subir las nuevas imágenes");

        const deleteResults = await Promise.all(
          previousImages
            .filter((image) => image?._id)
            .map((image) =>
              fetch(`${API_URL}${apiEndpoints.archives}/${image._id}`, { method: "DELETE" }),
            ),
        );
        if (deleteResults.some((response) => !response.ok)) {
          throw new Error("Las imágenes nuevas se guardaron, pero no se pudieron retirar todas las anteriores");
        }
      }

      alert("¡Post actualizado exitosamente!");
      window.dispatchEvent(new Event("nuevo-post-creado"));
      onSuccess?.(postBody);
    } catch (error) {
      console.error("Error al editar post:", error);
      alert(error.message || "Error al editar el post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Card className="mx-auto my-5 bg-dark text-light" style={{ width: "100%", maxWidth: "800px" }}>
          <Card.Header className="p-3">
            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
              <Card.Title className="mb-0">Editando post de @{user?.nickName}</Card.Title>
              <div className="d-flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" variant="primary" disabled={submitting}>
                  {submitting ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-3">
            <Form.Group controlId="editContent" className="mb-3">
              <Form.Label>Contenido del post:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={content}
                maxLength={500}
                onChange={(event) => setContent(event.target.value)}
                className="bg-dark text-light border-secondary"
              />
              <Form.Text className="text-muted d-block text-end">{content.length}/500 caracteres</Form.Text>
            </Form.Group>

            <Form.Group controlId="editImages">
              <Form.Label>Reemplazar imágenes:</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => {
                  const files = Array.from(event.target.files);
                  if (files.length > 5) {
                    alert("Podés subir hasta 5 imágenes por publicación.");
                    event.target.value = "";
                    setImages([]);
                    return;
                  }
                  setImages(files);
                }}
                className="bg-dark text-light border-secondary"
              />
              <Form.Text className="text-muted">
                Las imágenes actuales solo se reemplazarán si seleccionás archivos nuevos.
              </Form.Text>
            </Form.Group>
          </Card.Body>

          <Card.Footer className="bg-dark border-secondary p-3 text-center">
            <Button type="button" variant="outline-success" size="sm" onClick={() => setShowTagModal(true)}>
              Editar Tags
            </Button>
          </Card.Footer>
        </Card>
      </Form>

      <FormTag
        show={showTagModal}
        onHide={() => setShowTagModal(false)}
        post={post}
      />
    </>
  );
};

export default FormEditarPost;
