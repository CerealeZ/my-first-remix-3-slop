# Capacidades Del Framework

## Resumen ejecutivo

Este proyecto usa Remix 3 como framework server-first. En la practica, eso significa que primero construyes una ruta HTTP correcta y despues, solo si lo necesitas, agregas comportamiento de navegador.

La combinacion de Remix 3 y este starter te da una base para construir:

- sitios y apps renderizadas en servidor
- flujos de autenticacion y sesiones
- formularios y acciones HTTP tipadas
- middleware de request
- assets de navegador e hidratacion selectiva
- modulos de datos, validacion y persistencia

## Lo que este starter ya resuelve

Aunque hoy el repositorio es pequeno, ya deja montadas varias decisiones importantes:

### 1. Servidor HTTP listo para usar

`server.ts` levanta el servidor, delega el request al router y devuelve `500` si algo falla sin controlar.

### 2. Rutas tipadas

`app/routes.ts` define el contrato de URLs. Eso evita rutas desperdigadas por el codigo y permite generar links desde una sola fuente de verdad.

Hoy existen estas rutas:

- `home`: `/`
- `auth`: `/auth`
- `assets`: `/assets/*path`

### 3. Controladores separados por ownership

Cada ruta apunta a un controlador concreto en `app/controllers/`. Esto hace mas facil delegar trabajo a personas o agentes sin mezclar responsabilidades.

### 4. Renderizado HTML centralizado

`app/utils/render.tsx` concentra el render a `Response`, incluyendo resolucion de frames HTML.

### 5. Pipeline de assets del navegador

`app/assets.ts` expone un asset server que compila y sirve modulos del cliente bajo `/assets`.

### 6. UI compartida

`app/ui/` ya contiene layout, document wrapper y componentes reutilizables.

## Capacidades reales que Remix pone a tu disposicion aqui

Estas capacidades no estan todas implementadas aun en la aplicacion, pero el framework y la estructura elegida estan preparados para ellas.

### Routing y controladores

Puedes:

- definir rutas GET y POST de forma tipada
- mapear handlers por ruta
- devolver `Response` explicitas
- redirigir de forma clara despues de formularios o acciones

### Middleware

Puedes introducir middleware para:

- autenticacion
- sesiones
- compresion
- inyeccion de contexto
- logging
- CORS cuando sea necesario

### Validacion y datos

El ecosistema de Remix 3 que acompana a este starter permite:

- validar `Request`, `FormData`, params y cookies
- modelar tablas y persistencia
- trabajar con SQLite, Postgres o MySQL
- crear migraciones

### Autenticacion y sesiones

Puedes construir:

- login y logout
- signup
- sesiones con cookie segura
- proteccion de rutas
- proveedores externos OAuth u OIDC

### UI e interactividad

Puedes mantener la mayor parte de la app en server render y agregar interactividad puntual para:

- botones con comportamiento cliente
- componentes hidratados
- frames y navegacion parcial
- estilos y mixins reutilizables

## En que destaca esta base

No intenta darte "todo" desde el dia uno. Destaca en estas cosas:

- ownership claro de rutas
- crecimiento incremental
- menor acoplamiento entre UI compartida y codigo de ruta
- arquitectura facil de automatizar con agentes
- punto de entrada claro para meter middleware, datos y auth mas adelante

## Casos de uso adecuados

Esta base encaja bien si quieres montar:

- un panel interno
- una app con login y areas privadas
- un MVP server-first
- una aplicacion con formularios y acciones HTTP simples
- una web que necesite algo de interactividad, pero no una SPA total desde el inicio

## Limites del estado actual del repositorio

Conviene ser preciso: el framework puede hacer mucho, pero este starter todavia no trae de serie:

- base de datos configurada
- middleware personalizado
- autenticacion real implementada
- sesiones activas
- test suite de ejemplo
- areas protegidas

Eso no es una carencia accidental; es parte del enfoque del starter: empezar pequeno y crecer solo donde haga falta.

## Regla operativa mas importante

Primero haz correcta la ruta del servidor. Despues agrega datos, auth o comportamiento cliente. Esa disciplina evita mucha complejidad innecesaria.

## Siguiente lectura recomendada

Ve a [guia-de-trabajo.md](./guia-de-trabajo.md) para ver como construir sobre esta base sin romper la estructura.