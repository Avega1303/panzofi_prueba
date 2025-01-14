import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import { Bar, Pie, Column } from "@ant-design/plots";
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

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [dataPie, setDataPie] = useState([]);
  const [sessionDatesData, setSessionDatesData] = useState([]);

  useEffect(() => {

    fetch('/userprofile/api/userlist/users/')
      .then(response => response.json())
      .then(data => {
        // Mapear datos para adaptarlos al formato de la tabla
        const tableData = data.map(user => ({
          key: user.username, 
          username: user.username,
          lastSessionDate: user.last_session_date
          ? new Date(user.last_session_date).toISOString().split('T')[0]
            : 'No data',
            sessionInfo: user.session_time ? Math.round(user.session_time / 60) 
            : 0,
          variableB1: user.variableB1 || 'No data',
          variableB2: user.variableB2 || 'No data',
        }));
        setData(tableData);  

        // Calcular las sumas de variableB1 y variableB2
        const sumVariableB1 = data.reduce((sum, user) => sum + (user.variableB1 || 0), 0);
        const sumVariableB2 = data.reduce((sum, user) => sum + (user.variableB2 || 0), 0);

        // Configurar los datos para la gráfica de torta
        setDataPie([
          { type: 'Variable B1', value: sumVariableB1 },
          { type: 'Variable B2', value: sumVariableB2 },
        ]);

         // Agrupar usuarios por fecha de sesión
        const dateCount = data.reduce((acc, user) => {
          const date = user.last_session_date
            ? new Date(user.last_session_date).toLocaleDateString() 
            : 'No data';
          acc[date] = (acc[date] || 0) + 1; // Aumentamos el conteo por fecha
          return acc;
        }, {});

        // Convertir el objeto de fechas y contadores en un arreglo
        const dateData = Object.keys(dateCount).map(date => ({
          date,
          count: dateCount[date], 
        }));

        setSessionDatesData(dateData); // Guardamos los datos para el gráfico en el estado `sessionDatesData`

      })
      .catch(error => console.error('Error al obtener los datos:', error));
  }, []);  

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),  // Ordenar por nombre
    },
    {
      title: 'Inicio de Sesión',
      dataIndex: 'lastSessionDate',
      sorter: (a, b) => new Date(a.lastSessionDate) - new Date(b.lastSessionDate),
    },
    {
      title: 'Minutos por Sesión',
      dataIndex: 'sessionInfo',
      sorter: (a, b) => a.sessionInfo - b.sessionInfo,
    },
    {
      title: 'Boton 1',
      dataIndex: 'variableB1',
      sorter: (a, b) => a.variableB1 - b.variableB1,
    },
    {
      title: 'Botón 2',
      dataIndex: 'variableB2',
      sorter: (a, b) => a.variableB2 - b.variableB2,
    },
  ];

  // Configuración del gráfico de barras de Session Time
  const bar1Config = {
    data: data.map((user) => ({
      type: user.username, 
      value: user.sessionInfo,
    })),
    xField: "type", // Campo para el eje X (usuarios)
    yField: "value", // Campo para el eje Y (tiempo en minutos)
    colorField: "type", // Colores basados en los usuarios
    state: {
      unselected: { opacity: 0.5 }, 
      selected: { lineWidth: 3, stroke: "red" },
    },
    interactions: [{ type: "element-selected" }], // Habilitar selección de elementos    
  };

  // Configuración del gráfico de torta
  const pieConfig = {
    data: dataPie, // Datos que pasamos de variableB1 y variableB2
    angleField: 'value', // Campo para el ángulo de la gráfica de torta
    colorField: 'type', // Campo para los colores de la torta
    label: {
      text: 'value', // Mostrar el valor en cada segmento
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      position: 'right',
    },
  };

  // Configuración del gráfico de barras para fechas de sesión
  const bar2Config = {
    data: sessionDatesData, 
    xField: 'date',
    yField: 'count', 
    colorField: 'date', 
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    //Logout
    await fetch("http://localhost:8000/userprofile/api/logout/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
    });
    const redirectUrl = data.redirect_to || "/"

    navigate(redirectUrl);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2 style={{ textAlign: "center", margin: "20px 0" }}>
        Bienvenido al Panel de Administrador
      </h2>
  
      <Table 
        columns={columns} 
        dataSource={data} 
        onChange={(pagination, filters, sorter, extra) => {
          console.log('params', pagination, filters, sorter, extra);
        }} 
        style={{ marginBottom: '20px', width: '100%', maxWidth: '900px' }} // Ajusta el ancho de la tabla
      />
  
      <section style={{ textAlign: "center", margin: "20px 0", width: '100%', maxWidth: '900px' }}>
        <h3>Gráficos</h3>
  
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ width: '30%', marginBottom: '20px' }}>
            <h4>Tiempo de Sesión por Usuario</h4>
            <Bar {...bar1Config} />
          </div>
          
          <div style={{ width: '30%', marginBottom: '20px' }}>
            <h4>Comparación entre Botones</h4>
            <Pie {...pieConfig} />
          </div>
  
          <div style={{ width: '30%', marginBottom: '20px' }}>
            <h4>Usuarios por Fecha de Sesión</h4>
            <Column {...bar2Config} />
          </div>
        </div>
      </section>
  
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button type="primary" onClick={() => handleLogout()}>
          Salir
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
