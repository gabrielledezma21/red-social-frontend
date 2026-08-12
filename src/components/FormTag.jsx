import { useEffect, useState } from "react";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { getAllTags } from "./functions/get/getAllTags";
import { API_URL, apiEndpoints } from "../config/api";

const EMPTY_TAGS = [];
const tagName = (tag) => tag?.nameTag || tag?.name || String(tag || "");

const FormTag = ({ show = false, onHide = () => {}, onTagsSelected, selectedTags = EMPTY_TAGS, post }) => {
  const [tags, setTags] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [existingIds, setExistingIds] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!show) return;

    const loadTags = async () => {
      setLoading(true);
      setError("");
      const received = await getAllTags();
      setTags(received || []);

      const current = post?.tags || selectedTags;
      const ids = current.map((tag) => (typeof tag === "string" ? tag : tag._id)).filter(Boolean);
      setSelectedIds(ids);
      setExistingIds(post ? ids : []);
      setLoading(false);
    };

    loadTags();
  }, [show, post, selectedTags]);

  const createTag = async () => {
    const nameTag = newTag.trim().replace(/^#/, "");
    if (!nameTag) return;

    setCreating(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}${apiEndpoints.tags}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameTag }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "No se pudo crear el tag");

      setTags((current) => [...current, body]);
      setSelectedIds((current) => [...new Set([...current, body._id])]);
      setNewTag("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCreating(false);
    }
  };

  const saveTags = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (post?._id) {
        const addIds = selectedIds.filter((id) => !existingIds.includes(id));
        const removeIds = existingIds.filter((id) => !selectedIds.includes(id));

        await Promise.all([
          ...addIds.map((id) =>
            fetch(`${API_URL}${apiEndpoints.posts}/${post._id}/tags/${id}`, { method: "POST" }),
          ),
          ...removeIds.map((id) =>
            fetch(`${API_URL}${apiEndpoints.posts}/${post._id}/tags/${id}`, { method: "DELETE" }),
          ),
        ].map(async (request) => {
          const response = await request;
          if (!response.ok) throw new Error("No se pudieron guardar los tags del post");
        }));

        window.dispatchEvent(new Event("post-actualizado"));
        window.dispatchEvent(new Event("nuevo-post-creado"));
      }

      onTagsSelected?.(tags.filter((tag) => selectedIds.includes(tag._id)));
      onHide();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>{post ? "Editar Tags del Post" : "Seleccionar Tags"}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={saveTags}>
        <Modal.Body className="bg-dark text-light">
          {error && <Alert variant="danger">{error}</Alert>}

          <div className="d-flex gap-2 mb-4">
            <Form.Control
              value={newTag}
              maxLength={40}
              placeholder="Nombre del nuevo tag"
              aria-label="Nombre del nuevo tag"
              onChange={(event) => setNewTag(event.target.value)}
            />
            <Button type="button" variant="outline-warning" disabled={creating || !newTag.trim()} onClick={createTag}>
              {creating ? "Creando..." : "Crear Tag"}
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-3"><Spinner animation="border" size="sm" /> Cargando tags...</div>
          ) : tags.length > 0 ? (
            <div className="row g-2">
              {tags.map((tag) => (
                <div key={tag._id} className="col-12 col-sm-6 col-md-4">
                  <Form.Check
                    type="checkbox"
                    id={`tag-${tag._id}`}
                    label={`#${tagName(tag)}`}
                    checked={selectedIds.includes(tag._id)}
                    onChange={(event) =>
                      setSelectedIds((current) =>
                        event.target.checked
                          ? [...new Set([...current, tag._id])]
                          : current.filter((id) => id !== tag._id),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-3">No hay tags disponibles. Podés crear el primero arriba.</div>
          )}
        </Modal.Body>

        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="outline-secondary" type="button" onClick={onHide}>Cancelar</Button>
          <Button variant="success" type="submit" disabled={loading || submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FormTag;
