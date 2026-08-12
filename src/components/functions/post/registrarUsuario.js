import { API_URL, apiEndpoints } from '../../../config/api';

const registrarUsuario = async (bodyUsuario) => {
  const response = await fetch(`${API_URL}${apiEndpoints.users}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nickName: bodyUsuario.nickName.trim(),
      email: bodyUsuario.email.trim().toLowerCase(),
    }),
  });

  const responseBody = await response.json().catch(() => null);
  if (!response.ok) {
    const message = Array.isArray(responseBody?.error)
      ? responseBody.error.join(". ")
      : responseBody?.error || responseBody?.message;
    throw new Error(message || "Error al registrar usuario");
  }

  return responseBody;
};

export default registrarUsuario;
