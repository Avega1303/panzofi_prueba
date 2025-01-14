import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Input, Button, message } from "antd";
import { UserOutlined,LockOutlined } from "@ant-design/icons";

// Función para obtener el token CSRF desde las cookies
function getCSRFToken() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrftoken') {
        return value;
      }
    }
    return null;
  }

function Home() {

    const [formData, setFormData] = useState({
        username: "",
        password: "",   
    });

    const {username,password,} = formData;

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSuperUser, setIsSuperUser] = useState(false);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        // Obtener el token CSRF
        const csrfToken = getCSRFToken();

        try {
            // Enviar solicitud al backend
            const response = await fetch("http://localhost:8000/userprofile/api/login/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify(formData),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.is_superuser) {
                    setIsSuperUser(true);  // Si es superusuario
                }
                setIsAuthenticated(true); // Usuario autenticado
            } else {
                // Mostrar mensaje de error
                const data = await response.json();
                message.error(data.error || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            message.error("No se pudo conectar al servidor");
        }

        };
    
    if(isAuthenticated) {
        if (isSuperUser) {
            return <Navigate to='/admin_page'/>; // Redirige al AdminPage
        } else {
            return <Navigate to='/user_page'/>; // Redirige al UserPage
        }
    }

    return (
    <>
        <form
            onSubmit={e => onSubmit(e)}
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh", 
            }}
        >
            {/* Usuario */}
            <Input 
                name="username"
                value={username}
                onChange={onChange}
                type="text"
                required
                placeholder="Nombre de Usuario" 
                prefix={<UserOutlined />} 
                className="input-small"/>
            <br />

            {/* Contraseña */}
            <Input 
                name="password"
                value={password}
                onChange={onChange}
                type="password"
                required
                placeholder="Contraseña de Usuario" 
                prefix={<LockOutlined />} 
                className="input-small" />
            <br />

            {/* Botón de Acción */}
            <Button 
                type="primary" 
                htmlType="submit"
                className="input-small"
            > 
                Iniciar Sesión
            </Button>
        </form>
    </>
  );
}
export default Home;