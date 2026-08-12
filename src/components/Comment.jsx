import { deleteFunctions } from "./functions";
import { Card, Button } from 'react-bootstrap';
import { useState, useContext } from "react";
import FormEditarComment from "./FormEditarComment";
import { UserContext } from "../context/UserContext";

const formatCommentDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("es-AR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

const Comment = ({ comment, user: commentUser }) => {
    const { user: loggedUser } = useContext(UserContext);
    const [editando, setEditando] = useState(false);

    const eliminarComment = async () => {
        await deleteFunctions.deleteComment(comment._id);
    };

    return editando ? (
        <FormEditarComment
            comment={comment}
            user={loggedUser}
            onCancel={() => setEditando(false)}
            onSuccess={() => {
                setEditando(false);
                window.dispatchEvent(new Event("nuevo-comment-creado"));
            }}
        />
    ) : (
        <Card className="w-100 w-md-75 w-lg-50 mx-auto my-5 bg-light text-dark border-dark" style={{ minHeight: '10rem', maxWidth: '60vw' }}>
            <Card.Header className="d-flex justify-content-between align-items-center text-light gap-2">
                <div>
                    <Card.Title className="mb-1 text-dark">@{commentUser?.nickName}</Card.Title>
                    <Card.Subtitle className="text-muted">
                        {formatCommentDate(comment.fecha)}
                    </Card.Subtitle>
                </div>
                <div className="d-flex gap-2">
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => setEditando(true)}
                        className="w-100 w-md-auto"
                    >
                        Editar
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        className="w-100 w-md-auto"
                        onClick={eliminarComment}
                    >
                        Eliminar
                    </Button>
                </div>
            </Card.Header>
            <Card.Body className="text-dark bg-light rounded">
                <Card.Text className="text-justify">
                    {comment.content}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Comment;
