import Form from 'react-bootstrap/Form';

const PasswordInput = ({ password, setPassword, isInvalid }) => {
    return (
        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
                type="password"
                isInvalid={isInvalid}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                aria-describedby="demo-password-help"
            />
            <Form.Text id="demo-password-help" className="text-light">
                Acceso demostrativo: la contraseña es <strong>123456</strong>.
                El inicio de sesión es únicamente visual porque el proyecto está enfocado en el backend.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
                La contraseña ingresada no es correcta.
            </Form.Control.Feedback>
        </Form.Group>
    );
};

export default PasswordInput;
