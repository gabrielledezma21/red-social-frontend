import { deleteFunctions } from "./functions";
import { Card, Button } from 'react-bootstrap';
import { useState, useContext } from "react";
import FormEditarComment from "./FormEditarComment";
import { UserContext } from "../context/UserContext";
import { formatDateTime } from "../utils/formatDateTime";

const Comment = ({ comment, user: commentUser, onDeleted, onUpdated }) => {
    const { user: loggedUser } = useContext(UserContext);
    const [editando, setEditando] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const commentUserId = typeof comment.userId === "string"
        ? comment.userId
        : comment.userId?._id;
    const isOwner = Boolean(loggedUser?._id && loggedUser._id === commentUserId);

    const eliminarComment = async () => {
        try {
            setDeleting(true);
            const deletedComment = await deleteFunctions.deleteComment(comment._id);
            if (deletedComment) {
                onDeleted?.(comment._id);
            }
        } finally {
            setDeleting(false);
        }
    };

    return editando ? (
        <FormEditarComment
            comment={comment}
            user={loggedUser}
            onCancel={() => setEditando(false)}
            onSuccess={(updatedComment) => {
                setEditando(false);
                onUpdated?.(updatedComment);
            }}
        />
    ) : (
        <Card className="w-100 w-md-75 w-lg-50 mx-auto my-5 bg-light text-dark border-dark" style={{ minHeight: '10rem', maxWidth: '60vw' }}>
            <Card.Header className="d-flex justify-content-between align-items-center gap-2">
                <div>
                    <Card.Title className="mb-1 text-dark">@{commentUser?.nickName || "Usuario"}</Card.Title>
                    <Card.Subtitle className="text-muted">
                        {formatDateTime(comment.fecha)}
                    </Card.Subtitle>
                </div>
                {isOwner && (
                    <div className="d-flex gap-2">
                        <Button
                            variant="warning"
                            size="sm"
                            type="button"
                            onClick={() => setEditando(true)}
                            disabled={deleting}
                        >
                            Editar
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            type="button"
                            onClick={eliminarComment}
                            disabled={deleting}
                        >
                            {deleting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </div>
                )}
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
