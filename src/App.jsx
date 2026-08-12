import {
  Navigate,
  Route,
  Routes,
  BrowserRouter as Router,
} from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import Footer from "./components/Footer";
import PerfilEdit from "./pages/PerfilEdit";
import { useState, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import { UsuariosProvider } from "./context/UsuariosContext";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("No se pudo recuperar la sesión guardada:", error);
    localStorage.removeItem("user");
    return null;
  }
};

function App() {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UsuariosProvider>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/users/:userId" element={<Perfil />} />
                <Route path="/editar-perfil" element={<PerfilEdit />} />
                <Route path="/*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </UserContext.Provider>
    </UsuariosProvider>
  );
}

export default App;
