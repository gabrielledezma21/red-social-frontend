import { API_URL, apiEndpoints } from '../../../config/api';

export async function deleteComment(commentId) {
  const confirmar = window.confirm(
    "¿Estás seguro de que querés eliminar este comentario?"
  );
  if (!confirmar) return null;

  try {
    const response = await fetch(`${API_URL}${apiEndpoints.comments}/${commentId}`, {
      method: "DELETE",
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.message || "Error al eliminar el comentario");
    }

    window.dispatchEvent(new CustomEvent("comentarios-actualizados", {
      detail: { action: "delete", commentId }
    }));

    return data?.deletedComment || { _id: commentId };
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert(error.message || "Hubo un error al eliminar el comentario.");
    return null;
  }
}
