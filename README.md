# Scoolfy - Frontend

Aplicación web desarrollada en **Angular**, enfocada en la gestión de estudiantes, registro de datos personales, captura de huellas dactilares (simulada) y consulta de estudiantes registrados.  
Forma parte del ecosistema **Fingerprint Comparator Web**.

---

## Tecnologías principales

- **Angular 16+**
- **Angular Material**
- **Reactive Forms**
- **TypeScript**
- **SCSS / CSS**
- **Material Stepper & Material Table**
- **Simulación de SDK de Huellas (WebSDK wrapper)**

---

## Funcionalidades actuales

### 1. Registro de estudiantes (multistep form)

Proceso dividido en **tres pasos**:

#### **Paso 1 — Datos básicos**

El usuario ingresa:

- Nombres
- Apellidos
- Identificación
- Email
- Grado
- Grupo

Incluye:

- Validaciones en tiempo real
- Íconos de estado (correcto, incorrecto, pendiente)
- Tooltips con mensajes de error personalizados

#### **Paso 2 — Captura de huellas**

La captura está **simulada**:

- Permite agregar múltiples huellas
- Se genera un código único por cada captura
- Se pueden eliminar huellas
- Estados visuales: "Capturando...", "Capturado", "Sin capturar"

#### **Paso 3 — Confirmación**

Antes de guardar:

- Se muestra un resumen del estudiante
- Se listan las huellas capturadas
- Se confirma el registro

Se usa un **Toast / Snackbar** para mostrar confirmaciones o errores.

---

### 2. Consulta de estudiantes

Disponible en la ruta:

`/students`

Incluye:

- Tabla con listado de estudiantes
- Barra de búsqueda inteligente
- Filtros por:
  - Nombre
  - Apellido
  - Identificación
  - Grado
  - Grupo
- Tabla responsiva con Angular Material Table

---

## Arquitectura del proyecto

El sistema usa arquitectura **por features**, organizada así:

```
src/app/
│
├── core/                # Servicios globales (toast, helpers)
│
├── features/
│   ├── registry/        # Registro de estudiantes
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   │
│   ├── students/        # Listado y consulta
│   │   ├── students-list/
│   │   └── students.module.ts
│   │
│   ├── access/          # (Futuro)
│   └── home/            # Página inicial
│
├── shared/              # Constantes y utilidades
└── app.module.ts
```

---

## API consumida por el frontend

El frontend consume un servicio REST que expone:

```
GET  /registry  → obtiene todos los estudiantes
POST /registry  → registra un estudiante
```

---

## Requisitos para levantar el proyecto

### Node recomendado

- **Node 18.x o 20.x**

### Angular CLI

Instalar globalmente:

```
npm install -g @angular/cli
```

### Instalar dependencias

En la raíz del proyecto:

```
npm install
```

### Backend activo (opcional para pruebas completas)

Debe exponer:

```
http://localhost:8081/scoolfy/registry
```

Se configura en:

```
src/environments/environment.ts
```

---

## Cómo correr el proyecto

Ejecuta:

```
ng serve -o
```

La aplicación se abre en:

```
http://localhost:4200
```
