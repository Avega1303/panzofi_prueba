import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const getCSRFToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
      return value;
    }
  }
  return null;
};

const UserPage = () => {

  const [sessionStart, setSessionStart] = useState(null);  // Hora de inicio
  const navigate = useNavigate();

  useEffect(() => {

    setSessionStart(Date.now());

    const checkAndUpdateSession = async () => {
      try {
        const response = await fetch("http://localhost:8000/userprofile/api/updatesession/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken(),
          },
        });
        const data = await response.json();
        message.info(data.message);
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        message.error("No se pudo conectar al servidor");
      }
    };
    checkAndUpdateSession();
  }, []); 

  const updateClick = async(buttonId) => {
    try{
      const response = await fetch(`http://localhost:8000/userprofile/api/buttonclick/${buttonId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
    });
    const data = await response.json();

      if (response.ok) {
        message.success("Contador actualizado correctamente");
      } else {
        message.error(data.error || "Error al actualizar el contador");
      }

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      message.error("No se pudo conectar al servidor");
    }
  };

  const handleLogout = async () => {

    const endTime = Date.now();

    const sessionDuration = Math.floor((endTime - sessionStart) / 1000);

    try {
      const response = await fetch("http://localhost:8000/userprofile/api/updatetime/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({ session_time: sessionDuration }),  // Enviamos la duración de la sesión
      });
      const data = await response.json();

      if (response.ok) {

        message.success(data.message);

        //Logout
        await fetch("http://localhost:8000/userprofile/api/logout/", {
          method: "POST",
          headers: {
            "X-CSRFToken": getCSRFToken(),
          },
        });
        const redirectUrl = data.redirect_to || "/"

        navigate(redirectUrl);

      } else {
        message.error("Error al guardar el tiempo de sesión");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      message.error("No se pudo conectar al servidor");
    }
  };

  return (
    <div style={{ padding: "30px", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Contenedor para la imagen y el texto */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>

          <img
            src="http://localhost:8000/media/LogoPanzofi.png" // Reemplaza con la URL de tu logo
            alt="Logo"
            style={{ width: 130, marginRight: "20px" }} // Ajuste de margen a la derecha
          />
         
          <div style={{ textAlign: "left" }}>
            <h2 level={2}>Bienvenido a tu página de Usuario</h2>
            <p>
            Esta es una prueba de desarrollo con Django y React para Panzofi. Por favor, haz clic en cualquiera de los botones que se encuentran abajo.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button 
          type="primary" icon={<span role="img" aria-label="click">👆</span>} size="large"
          onClick={() => updateClick(1)}
          >
            Botón 1
          </Button>
          <Button type="primary" icon={<span role="img" aria-label="click">👆</span>} size="large"
          onClick={() => updateClick(2)}
          >
            Botón 2
          </Button>
        </div>

        <div style={{ marginTop: "40px" }}>
          <Button type="primary" size="large"
          onClick={handleLogout}
          >
            Guardar Sesión y Salir
          </Button>
        </div>
      </div>
    </div>
  );
}
export default UserPage;