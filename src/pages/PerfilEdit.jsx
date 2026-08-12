import { UserContext } from "../context/UserContext";
import { UsuariosContext } from "../context/UsuariosContext";
import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { putFunctions, deleteFunctions } from "../components/functions";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function PerfilEdit() {
  const { user, setUser } = useContext(UserContext);
  const { usuarios, actualizarUsuarios } = useContext(UsuariosContext);
  const [nickName, setNickName] = useState(user?.nickName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const normalizedNickName = nickName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const duplicateNick = usuarios.some(
    (item) => item._id !== user._id && item.nickName.toLowerCase() === normalizedNickName.toLowerCase()
  );
  const duplicateEmail = usuarios.some(
    (item) => item._id !== user._id && item.email.toLowerCase() === normalizedEmail
  );
  const validNickName = normalizedNickName.length >= 2 && !duplicateNick;
  const validEmail = emailPattern.test(normalizedEmail) && !duplicateEmail;
  const unchanged = normalizedNickName === user.nickName && normalizedEmail === user.email.toLowerCase();

  const modificarUsuario = async (event) => {
    event.preventDefault();
    if (!validNickName || !validEmail || unchanged) return;

    try {
      setSaving(true);
      const updatedUser = await putFunctions.modificarUsuario(user._id, {
        nickName: normalizedNickName,
        email: normalizedEmail,
      });
      setUser(updatedUser);
      await actualizarUsuarios();
      navigate(`/users/${user._id}`);
    } catch (error) {
      alert(error.message || "No se pudo modificar el usuario.");
    } finally {
      setSaving(false);
    }
  };

  const eliminarCuenta = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      setSaving(true);
      await deleteFunctions.deleteUser(user._id);
      setUser(null);
      await actualizarUsuarios();
      navigate("/");
    } catch (error) {
      alert(error.message || "No se pudo eliminar la cuenta.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-secondary text-light">
      <div className="container-fluid flex-grow-1">
        <div className="row h-100 min-vh-100">
          <div className="col-12 d-flex align-items-center justify-content-center">
            <div className="w-100 px-4 py-5 bg-dark rounded" style={{ maxWidth: "500px" }}>
              <div className="text-center mb-4">
                <h2 className="text-primary mb-2">ANTI-SOCIALNET</h2>
                <p className="text-light">Tu red social favorita</p>
              </div>

              <h1 className="text-center mb-3 h2">Editar Perfil</h1>
              <Form onSubmit={modificarUsuario}>
                <Form.Group className="mb-3" controlId="formBasicNickname">
                  <Form.Label>Nombre de Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    value={nickName}
                    minLength={2}
                    maxLength={50}
                    onChange={(event) => setNickName(event.target.value)}
                    isInvalid={nickName.length > 0 && !validNickName}
                    disabled={saving}
                  />
                  <Form.Control.Feedback type="invalid">
                    Debe tener al menos 2 caracteres y no estar en uso.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    isInvalid={email.length > 0 && !validEmail}
                    disabled={saving}
                  />
                  <Form.Control.Feedback type="invalid">
                    Ingresa un email válido que no esté en uso.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="submit" variant="primary" size="lg" disabled={saving || !validNickName || !validEmail || unchanged}>
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Button type="button" variant="outline-danger" size="lg" onClick={eliminarCuenta} disabled={saving}>
                    Eliminar Cuenta
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
