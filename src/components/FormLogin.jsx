import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { NickNameInput, PasswordInput } from './FormLogin-components';
import { useState, useContext } from "react";
import { UserContext } from '../context/UserContext';
import { UsuariosContext } from "../context/UsuariosContext";
import { useNavigate } from "react-router-dom";
import { getFunctions } from "./functions";

const FormLogin = () => {
  const navigate = useNavigate();
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('123456');
  const [passwordInvalida, setPasswordInvalida] = useState(false);
  const [usuarioNoEncontrado, setUsuarioNoEncontrado] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { setUser } = useContext(UserContext);
  const { usuarios, actualizarUsuarios } = useContext(UsuariosContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setPasswordInvalida(false);
    setUsuarioNoEncontrado(false);

    if (password !== '123456') {
      setPasswordInvalida(true);
      return;
    }

    try {
      setSubmitting(true);
      let availableUsers = usuarios;
      if (availableUsers.length === 0) {
        availableUsers = await getFunctions.getAllUsers();
      }

      const normalizedNick = nickName.trim().toLowerCase();
      const foundUser = availableUsers.find(
        (item) => item.nickName.toLowerCase() === normalizedNick
      );
      if (!foundUser) {
        setUsuarioNoEncontrado(true);
        return;
      }

      const completeUser = await getFunctions.getUserByObjectId(foundUser._id);
      setUser(completeUser);
      actualizarUsuarios();
      navigate('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert("No se pudo iniciar sesión. Inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      <NickNameInput
        nickname={nickName}
        setNickname={setNickName}
        isInvalid={usuarioNoEncontrado}
      />
      <PasswordInput
        password={password}
        setPassword={setPassword}
        isInvalid={passwordInvalida}
      />
      <Button variant="primary" type="submit" disabled={submitting || !nickName.trim() || !password}>
        {submitting ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </Form>
  );
};

export default FormLogin;
