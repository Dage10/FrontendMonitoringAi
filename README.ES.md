# [English](README.md) | [Español](README.ES.md)

---

<div align="center">

# 🖥️ Panel de Monitoreo con IA — Frontend

**Dashboard de monitoreo en tiempo real para servicios HTTP desplegados**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Recharts 3](https://img.shields.io/badge/Recharts-3-FF6B6B?logo=recharts&logoColor=white)](https://recharts.org)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

![Vista Previa del Dashboard](https://placehold.co/1200x600/0F172A/6366F1?text=AI+Monitoring+Dashboard&font=roboto)

</div>

### 🖼️ Capturas de Pantalla

![Dashboard](./screenshots/Home.png)

### Dashboard

![Dashboard](./screenshots/dashboard_1.png)
![Dashboard](./screenshots/dashboard_2.png)

### Autenticacion

![SignIn](./screenshots/SignIn.png)
![SignUp](./screenshots/SignUp.png)

### Servicios

![Services](./screenshots/services.png)
![Create](./screenshots/create_service.png)
![Delete](./screenshots/delete_service.png)
![Edit](./screenshots/edit_service.png)
![View](./screenshots/view_service_1.png)
![View](./screenshots/view_service_2.png)
![View](./screenshots/view_service_3.png)

---

## 📖 Tabla de Contenidos

- [Acerca de](#-acerca-de)
- [Para Quién](#-para-quién)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Inicio Rápido](#-inicio-rápido)
- [Uso](#-uso)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Hoja de Ruta](#-hoja-de-ruta)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 📌 Acerca de

**Panel de Monitoreo con IA — Frontend** es un cliente Next.js que proporciona una interfaz de monitoreo en tiempo real para servicios HTTP desplegados. Se conecta a un backend Spring Boot mediante API REST y Server-Sent Events (SSE) para mostrar métricas en vivo (latencia, errores, disponibilidad), gráficos históricos con selección de rango flexible y autenticación multi-usuario.

Este repositorio contiene solo el frontend. Para el proyecto full-stack (backend API + frontend), ver [BackendMonitoringAi](https://github.com/Dage10/BackendMonitoringAi).

**En vivo:** [frontend-monitoring-ai.vercel.app](https://frontend-monitoring-ai.vercel.app)

---

## 👥 Para Quién

Desarrolladores frontend, estudiantes y equipos que necesitan monitoreo responsive en tiempo real para servicios HTTP.

---

## ✨ Características Principales

| Característica | Descripción |
|---|---|
| 📊 Dashboard en tiempo real | Métricas en vivo vía SSE: latencia, errores, uptime % |
| 🔐 Auth multi-usuario | Registro/login con cookies httpOnly JWT |
| 📈 Gráficos históricos | Recharts: línea de latencia, barras de errores, área de disponibilidad |
| ⏱️ Selector de rango | Últimos 60 min / Últimas 24 horas / Últimos 7 días |
| 📱 Totalmente responsive | Diseño mobile-first con sidebar hamburguesa |
| ⚡ Streaming SSE | Actualizaciones push en tiempo real sin polling |
| 🗃️ Paginación | Página de servicios: 3 elementos/página con paginación personalizada |
| 🛡️ Headers de seguridad | CSP, X-Frame-Options, XSS-Protection, Referrer-Policy |

---

## 🛠️ Stack Tecnológico

| Capa | Stack |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Gráficos | Recharts 3 (ResponsiveContainer) |
| HTTP | fetch API con credentials |
| SSE | EventSource con auto-reconnect |
| Despliegue | Vercel |

---

## 🚀 Inicio Rápido

**Prerequisitos:** Node.js 20+, backend API en ejecución

```bash
git clone https://github.com/Dage10/FrontendMonitoringAi.git
cd FrontendAiMonitoring/ai-monitoring-dashboard
npm install
cp .env.local.example .env.local  # Editar con URL del backend
npm run dev  # http://localhost:3000
```

> Ver [BackendMonitoringAi](https://github.com/Dage10/BackendMonitoringAi) para la API.

---

## 💡 Uso

1. **Registra** cuenta en `/auth/register`
2. **Inicia sesión** con tus credenciales
3. **Agrega servicios** (nombre + URL de health check)
4. **Ve el dashboard** — gráficos se actualizan vía SSE cada 30s
5. **Cambia rangos** — Últimos 60 min / 24 horas / 7 días
6. **Revisa anomalías** — el backend señala picos de latencia

---

## 🔧 Variables de Entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base de la API (SSR/cliente) | `/api` |
| `API_PROXY_URL` | URL del backend para proxy API de Next.js | `http://localhost:8080` |

---

## 📁 Estructura del Proyecto

```
app/
  (protected)/
    dashboard/page.tsx      # Dashboard principal con gráficos
    services/page.tsx       # Lista de servicios con paginación
    services/create/        # Agregar nuevo servicio
    services/[id]/edit/     # Editar servicio
    services/[id]/view/     # Ver métricas del servicio
  auth/
    login/page.tsx          # Formulario de login
    register/page.tsx       # Formulario de registro
  context/AuthContext.tsx   # Gestión de estado de auth
components/
  Sidebar.tsx              # Sidebar responsive con hamburguesa
  Header.tsx               # Barra de encabezado superior
  LatencyChart.tsx         # Recharts LineChart
  ErrorsChart.tsx          # Recharts BarChart
  AvailabilityChart.tsx    # Recharts AreaChart
  RangeSelector.tsx        # Selector de rango de tiempo
  Service.tsx              # Componente de tarjeta de servicio
  LoginRequired.tsx        # Componente de gate de autenticacion
lib/
  api.ts                   # Cliente API (fetch + credentials)
  sse.ts                   # Cliente SSE con auto-reconnect
  auth.ts                  # Utilidades de auth
  metrics.ts               # Tipos y utilidades de métricas
```

---

## 🗺️ Hoja de Ruta

- [ ] Alertas por email/webhook
- [ ] Intervalos de verificación personalizados
- [ ] Grupos de servicios y etiquetas
- [ ] Roles de usuario (admin/viewer)
- [ ] Alternar tema oscuro/claro
- [ ] Exportar a CSV
- [ ] Pruebas unitarias

---

## 🤝 Contribuir

Fork → rama → commit con [Conventional Commits](https://www.conventionalcommits.org/) → PR. Ejecutar `npm run lint` y `npm run build` antes de enviar.

---

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT — ver [LICENSE](../LICENSE) para detalles.

---

<div align="center">

**Hecho usando Next.js, React y mejores prácticas modernas 2026**

</div>
