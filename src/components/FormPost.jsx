import { Card, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import FormTag from "./FormTag";
import { API_URL, apiEndpoints } from "../config/api";
import { formatDateTime } from "../utils/formatDateTime";

const FormPost = ({ user }) => {
  const [content, setContent] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTagModal, setShowTagModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedContent = content.trim();

    if (normalizedContent.length < 5) {
      alert("La publicación debe tener al menos 5 caracteres.");
      return;
    }

    let createdPostId = null;
    setSubmitting(true);
    try {
      const responsePost = await fetch(`${API_URL}${apiEndpoints.posts}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          content: normalizedContent,
        }),
      });

      const postBody = await responsePost.json().catch(() => ({}));
      if (!responsePost.ok) {
        throw new Error(postBody.error || "Error al crear el post");
      }

      createdPostId = postBody._id;

      await Promise.all(
        tags.map(async (tag) => {
          const response = await fetch(
            `${API_URL}${apiEndpoints.posts}/${postBody._id}/tags/${tag._id}`,
            { method: "POST" },
          );
          if (!response.ok) throw new Error(`No se pudo asociar #${tag.nameTag}`);
        }),
      );

      if (imagenes.length > 0) {
        const formData = new FormData();
        formData.append("postId", postBody._id);
        imagenes.forEach((image) => formData.append("imagenes", image));

        const responseArchivos = await fetch(
          `${API_URL}${apiEndpoints.archives}`,
          { method: "POST", body: formData },
        );
        if (!responseArchivos.ok) throw new Error("Error al subir imágenes");
      }

      alert("¡Publicación realizada con éxito!");
      setContent("");
      setImagenes([]);
      setTags([]);
      window.dispatchEvent(new Event("nuevo-post-creado"));
    } catch (error) {
      if (createdPostId) {
        await fetch(`${API_URL}${apiEndpoints.posts}/${createdPostId}`, { method: "DELETE" }).catch(() => null);
      }
      console.error("Error al publicar:", error);
      alert(error.message || "Ocurrió un error al intentar publicar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Card className="mx-auto my-5 bg-dark text-light" style={{ width: "100%", maxWidth: "800px" }}>
          <Card.Header className="p-3">
            <div className="d-flex gap-3 justify-content-between align-items-center flex-wrap">
              <div>
                <Card.Title className="mb-1">@{user.nickName}</Card.Title>
                <Card.Subtitle className="text-secondary small">
                  {formatDateTime(currentTime)}
                </Card.Subtitle>
              </div>
              <Button variant="outline-success" size="sm" type="button" onClick={() => setShowTagModal(true)}>
                Agregar Tags
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-3">
                {tags.map((tag) => (
                  <span key={tag._id} className="badge bg-success">#{tag.nameTag}</span>
                ))}
              </div>
            )}
          </Card.Header>

          <Card.Body>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                className="bg-dark text-light"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files);
                  if (files.length > 5) {
                    alert("Podés subir hasta 5 imágenes por publicación.");
                    event.target.value = "";
                    setImagenes([]);
                    return;
                  }
                  setImagenes(files);
                }}
              />
            </Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              className="bg-dark text-light border-secondary"
              placeholder="¿Qué estás pensando publicar?"
              value={content}
              maxLength={500}
              onChange={(event) => setContent(event.target.value)}
            />
            <Form.Text className="text-muted d-block text-end">{content.length}/500 caracteres</Form.Text>
          </Card.Body>

          <Card.Footer className="bg-dark border-secondary p-3 text-center">
            <Button variant="primary" type="submit" disabled={submitting || content.trim().length < 5}>
              {submitting ? "Publicando..." : "Publicar"}
            </Button>
          </Card.Footer>
        </Card>
      </Form>

      <FormTag
        show={showTagModal}
        onHide={() => setShowTagModal(false)}
        onTagsSelected={setTags}
        selectedTags={tags}
      />
    </>
  );
};

export default FormPost;
