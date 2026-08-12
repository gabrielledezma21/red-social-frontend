import { deleteFunctions } from "./functions";
import { API_URL } from '../config/api'
import { Card, Button, Carousel, Row, Col } from "react-bootstrap";
import { useState, useContext, useEffect } from "react";
import CommentsModal from "./CommentsModal";
import FormEditarPost from "./FormEditarPost";
import { UserContext } from "../context/UserContext";
import Tag from './Tag';
import { formatDateTime } from '../utils/formatDateTime';

const Post = ({post, tags, user: postUser }) => {
  const [showModal, setShowModal] = useState(false);
  const { user: loggedUser } = useContext(UserContext);
  const [editando, setEditando] = useState(false);
  const [displayPost, setDisplayPost] = useState(post);

  useEffect(() => {
    setDisplayPost(post);
  }, [post]);

  if (!displayPost) return null;

  // Validaciones para imágenes
  const imagenes = displayPost.imagenes || [];
  const tieneImagenes = imagenes && imagenes.length > 0;

  // Funciones para manejar el modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  //Función para eliminar el post
  const eliminarPost = async () => {
    await deleteFunctions.deletePost(post._id);
  };

  return editando ? (//Si se está editando, se muestra el formulario de edición

    <FormEditarPost
      post={displayPost}
      user={loggedUser}
      onCancel={() => setEditando(false)}
      onSuccess={() => {
        setEditando(false);
        window.dispatchEvent(new Event("nuevo-post-creado"));
      }}
    />

  ) : (// Si no está editando, mostrar el post normal
    <>{/*Inicio del post normal*/}
      <Card
        className="w-100 w-md-75 w-lg-50 mx-auto my-5 bg-dark text-light"
        style={{ minHeight: "20rem", maxWidth: "60vw" }}
      >
        <Card.Header className="text-light p-3">
          <Row className="align-items-start g-2">
            {/* Información del usuario */}
            <Col xs={12} sm={6} md={4} lg={3}>
              <div>
                <Card.Title className="text-light mb-1 fs-6 fs-sm-5">
                  @{postUser?.nickName || "Usuario"}
                </Card.Title>
                <Card.Subtitle className="text-secondary small">
                  {formatDateTime(displayPost.fecha)}
                </Card.Subtitle>
              </div>
            </Col>

            {/* Tags - Se ocultan en mobile muy pequeño */}
            <Col xs={12} sm={6} md={5} lg={6}>
              <div className="d-flex gap-1 flex-wrap justify-content-start justify-content-sm-center">
                {tags &&
                  tags.length > 0 &&
                  tags.map((tag, index) => (// Muestra los tags si existen
                    <Button
                      key={index}
                      variant="success"
                      size="sm"
                      className="px-2 py-1"
                      style={{ fontSize: "0.75rem" }}
                    >
                      <span className="d-none d-sm-inline">{tag.nameTag}</span>
                      <span className="d-sm-none">
                        #{tag.nameTag.substring(0, 6)}
                      </span>
                    </Button>
                  ))}
              </div>
            </Col>

            {/* Botones de acción Editar y Eliminar */}
            {loggedUser && loggedUser._id === post.userId ? (// Si hay usuario, muestra los botones de editar y eliminar
              <Col xs={12} md={3}>
                <div className="d-flex flex-column flex-md-row gap-2 gap-md-1 justify-content-center justify-content-md-end">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => setEditando(true)}
                    className="w-100 w-md-auto"
                  >
                    <span className="d-none d-md-inline">Editar</span>
                    <span className="d-md-none">
                      <i className="bi bi-pencil me-2"></i>Editar
                    </span>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-100 w-md-auto"
                    onClick={eliminarPost}
                  >
                    <span className="d-none d-md-inline">Eliminar</span>
                    <span className="d-md-none">
                      <i className="bi bi-trash me-2"></i>Eliminar
                    </span>
                  </Button>
                </div>
              </Col>
            ) : <></>
            }
          </Row>

        </Card.Header>

        {/* Sección de imágenes */}
        {tieneImagenes && (//Si hay imagenes decide si muestra un carrusel o una sola imagen
          <div className="p-2">
            {imagenes.length > 1 ? (//Si hay mas de una imagen muestra el carousel
              <Carousel
                indicators={true}
                controls={true}
                interval={null}
                className="w-100"
              >
                {imagenes.map((imageObj, index) => {
                  if (!imageObj || !imageObj.imagen) {
                    return null;
                  }

                  return (
                    <Carousel.Item key={imageObj._id || index}>
                      <img
                        className="d-block w-100 rounded"
                        src={`${API_URL}${imageObj.imagen}`}
                        alt={`Imagen ${index + 1}`}
                        style={{ height: "35rem", objectFit: "contain" }}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=Error+al+cargar";
                        }}
                      />
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            ) : imagenes[0] && imagenes[0].imagen ? (//Sinó hay más de una imagen, muestra la primera
              <img
                className="d-block w-100 rounded"
                src={`${API_URL}${imagenes[0].imagen}`}
                alt="Imagen del post"
                style={{ height: "35rem", objectFit: "contain" }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Error+al+cargar";
                }}
              />
            ) : (
              <div className="p-3 text-center text-secondary">
                <small>Imagen no disponible</small>
              </div>
            )}
          </div>
        )}{/* Fin de la sección de imágenes */}

        <Card.Body className="text-light">
          <Card.Text className="text-light text-justify">
            {displayPost.content}
          </Card.Text>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-center align-items-center gap-2 text-light p-3">
          <Button variant="outline-primary" onClick={handleShowModal}>
            Ver Comentarios ({displayPost.comments?.length || 0})
          </Button>
        </Card.Footer>
      </Card>

      {/* Modal de comentarios */}
      <CommentsModal
        show={showModal}
        onHide={handleCloseModal}
        post={post}
        user={postUser}
        currentUser={loggedUser}
        onCommentsChanged={(comments) =>
          setDisplayPost((currentPost) => ({ ...currentPost, comments }))
        }
      />
      {/* Fin del post normal */}
    </>
  );
};

export default Post;
