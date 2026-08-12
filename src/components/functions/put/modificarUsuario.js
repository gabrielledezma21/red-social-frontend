import { API_URL, apiEndpoints } from "../../../config/api";

export const modificarUsuario = async (id, data) => {
  const response = await fetch(`${API_URL}${apiEndpoints.users}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseBody = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(responseBody?.error)
      ? responseBody.error.join(". ")
      : responseBody?.error || responseBody?.message;
    throw new Error(message || "Error al modificar el usuario");
  }

  return responseBody;
};
