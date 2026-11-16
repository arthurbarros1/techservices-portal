import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import TrocaSenha from "./pages/TrocaSenha.jsx";
import CadastroCliente from "./pages/CadastroCliente.jsx";
import Servicos from "./pages/Servicos.jsx";
import CadastroServico from "./pages/CadastroServico.jsx";
import RotaProtegida from "./components/layout/RotaProtegida.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/troca-senha" element={<TrocaSenha />} />
      <Route path="/cadastro" element={<CadastroCliente />} />
      <Route
        path="/servicos"
        element={<RotaProtegida><Servicos /></RotaProtegida>}
      />
      <Route
        path="/servicos/novo"
        element={<RotaProtegida><CadastroServico /></RotaProtegida>}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
