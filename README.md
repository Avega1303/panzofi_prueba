# panzofi_prueba

# Documentación

## Paquetes de instalación necesarios

A continuación se presentan los paquetes necesarios para ejecutar la aplicación, organizados por su clase:

### Backend (Django)

- `django==4.2.17`
- `django-environ==0.11.2`
- `django-cors-headers==4.6.0`
- `djangorestframework==3.15.2`

### Frontend (React)

- `@ant-design/charts==2.2.6`
- `@ant-design/plots==2.3.3`
- `@testing-library/jest-dom==5.17.0`
- `@testing-library/react==13.4.0`
- `@testing-library/user-event==13.5.0`
- `antd==5.23.0`
- `axios==1.7.9`
- `react==18.2.0`
- `react-dom==18.2.0`
- `react-router-dom==7.1.1`
- `react-scripts==5.0.1`
- `typescript==5.7.3`
- `web-vitals==2.1.4`

---

## Descripción del Proyecto

Esta aplicación se desarrolló utilizando Django y React para gestionar un sistema con dos tipos de usuarios: un administrador y 35 usuarios regulares.

### Funcionalidades:

#### Administrador:
- El superusuario tiene acceso a la consola de administración donde puede visualizar analíticos sobre los 35 usuarios regulares.
- Puede ver información como:
  - Última sesión de los usuarios.
  - Tiempo de sesión.
  - Información sobre las interacciones de los usuarios con dos botones presentes en la página principal de los usuarios.

#### Usuarios Regulares:
- Los usuarios pueden iniciar sesión con su nombre de usuario y contraseña.
- Después de iniciar sesión, ven una página de inicio (landing page) con un título, logo y una breve descripción.
- Además, tienen acceso a dos botones que funcionan como contadores. Se almacena un registro cada vez que un usuario presiona uno de los botones, junto con el tiempo que estuvo en la página.

---

## Usuarios:

#### Superusuario:
- **Nombre de usuario:** `Avega`
- **Contraseña:** `admin123`

#### Usuarios Regulares:
- Las credenciales de los usuarios regulares se encuentran en el archivo `user_passwords.txt` del proyecto.
