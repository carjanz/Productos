# Productos

📘 Introducción del Proyecto
El presente proyecto consiste en el desarrollo de una aplicación web integral orientada a la gestión de usuarios, calendario de actividades y control de productos. Esta plataforma está diseñada para facilitar el análisis financiero y la administración de datos a través de una interfaz intuitiva y moderna.

La solución está compuesta por un frontend dinámico y responsive construido con Angular, acompañado de una potente API REST desarrollada en .NET Core, que permite una integración segura, modular y escalable de todos los componentes del sistema.

🎯 Objetivos del Proyecto
Permitir la creación, listado y administración de usuarios.

Visualizar un calendario interactivo con funcionalidades de análisis financiero.

Gestionar un catálogo de productos con información detallada.

Proveer una estructura modular, mantenible y adaptable a nuevas funcionalidades.

🛠️ Reseña Técnica
Tecnologías empleadas:

Frontend:

HTML5, CSS3, TypeScript y Angular: Se desarrolló una interfaz limpia y modular, dividiendo los componentes por funcionalidades (products, calendar, dashboard, etc.), facilitando la escalabilidad y el mantenimiento.

Backend (API REST):

.NET Core / ASP.NET Web API: Implementación del backend con una arquitectura limpia y separada por capas (Application, Domain, Infrastructure, WebApi), permitiendo una alta cohesión y bajo acoplamiento.

Gestión de usuarios, autenticación, persistencia de datos y lógica de negocio distribuida en proyectos independientes.

Estructura del proyecto:

Frontend Angular (/src/app/features)

Módulos por funcionalidad: products, calendar, login, dashboard.

Componentes reutilizables y servicios integrados con la API.

Backend .NET (Solución FixedsApp)

Application: Lógica de negocio y servicios.

Domain: Entidades y reglas de dominio.

Infrastructure: Acceso a datos, servicios externos y utilidades.

WebApi: Controladores y configuración del host.

Características destacadas:

Calendario con vista mensual, que muestra días hábiles y fines de semana diferenciados visualmente.

Sección de productos con descripción e identificación única.

Navegación estructurada mediante dashboard lateral y enrutamiento.

Estilo visual consistente, moderno y limpio.

