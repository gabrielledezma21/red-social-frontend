import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { NickNameInput, EmailInput, CheckBox } from "./FormRegistro-components";
import { useMemo, useState, useContext } from "react";
import { postFunctions } from "./functions";
import { useNavigate } from "react-router-dom";
import { UsuariosContext } from "../context/UsuariosContext";

function FormularioDeRegistro() {
  const { usuarios, agregarUsuario } = useContext(UsuariosContext);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [aceptoTerminos, setAceptoTerminos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const normalizedNick = nickname.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const existingNickNames = useMemo(
    () => new Set(usuarios.filter(Boolean).map((item) => item.nickName.toLowerCase())),
    [usuarios]
  );
  const existingEmails = useMemo(
    () => new Set(usuarios.filter(Boolean).map((item) => item.email.toLowerCase())),
    [usuarios]
  );

  const duplicateNick = existingNickNames.has(normalizedNick.toLowerCase());
  const duplicateEmail = existingEmails.has(normalizedEmail);
  const nickInvalid = normalizedNick.length < 2 || duplicateNick;
  const emailInvalid = !/^\S+@\S+\.\S+$/.test(normalizedEmail) || duplicateEmail;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!aceptoTerminos || nickInvalid || emailInvalid) return;

    try {
      setSubmitting(true);
      const newUser = await postFunctions.registrarUsuario({
        nickName: normalizedNick,
        email: normalizedEmail,
      });
      agregarUsuario(newUser);
      navigate("/login");
    } catch (error) {
      alert(error.message || "No se pudo registrar el usuario.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <NickNameInput
        nickname={nickname}
        setNickname={setNickname}
        isInvalid={nickname.length > 0 && nickInvalid}
        errorMessage={duplicateNick ? "El nickname ya existe" : "El nickname debe tener al menos 2 caracteres"}
        isValid={nickname.length > 0 && !nickInvalid}
      />
      <EmailInput
        email={email}
        setEmail={setEmail}
        isInvalid={email.length > 0 && emailInvalid}
        errorMessage={duplicateEmail ? "El email ya está registrado" : "El email debe tener un formato válido"}
        isValid={email.length > 0 && !emailInvalid}
      />
      <CheckBox checked={aceptoTerminos} onChange={setAceptoTerminos} />
      <Button
        variant="primary"
        type="submit"
        disabled={submitting || !aceptoTerminos || nickInvalid || emailInvalid}
      >
        {submitting ? "Registrando..." : "Registrarse"}
      </Button>
    </Form>
  );
}

export default FormularioDeRegistro;
