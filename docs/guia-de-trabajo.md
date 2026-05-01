# Guia De Trabajo

## Para que sirve esta guia

Esta guia explica como desarrollar sobre este starter sin convertirlo en un proyecto desordenado.

## Principio central

Empieza siempre por el contrato del servidor y por el owner mas pequeno posible.

Traducido a trabajo diario:

1. Define o cambia la ruta.
2. Asigna su controlador.
3. Haz que devuelva la `Response` correcta.
4. Solo despues agrega UI compartida, datos o comportamiento de navegador.

## Flujo recomendado para crear una feature

### 1. Define la URL

Empieza por `app/routes.ts`.

Preguntate:

- cual es la URL
- que metodo HTTP necesita
- que nombre de ruta va a usar el proyecto

### 2. Conecta la ruta en el router

En `app/router.ts` enlazas la ruta con su controlador.

### 3. Crea el controlador minimo

Pon el handler en `app/controllers/`.

Usa archivo plano cuando:

- la ruta es simple
- solo tiene una accion
- no tiene subrutas ni modulos propios

Usa carpeta con `controller.tsx` cuando:

- la ruta crece
- tiene varias acciones
- necesita modulos locales
- va a tener subrutas

### 4. Extrae UI compartida solo cuando sea de verdad compartida

Si algo solo lo usa una ruta, dejalo junto a esa ruta.

Si lo usan varias zonas, muevelo a `app/ui/`.

### 5. Agrega datos y middleware cuando aparezca la necesidad

No abras `app/data/` o `app/middleware/` por costumbre. Abrelos cuando ya exista una necesidad concreta.

## Reglas practicas de organizacion

### Pon cada cosa en su sitio natural

- rutas en `app/routes.ts`
- wiring del router en `app/router.ts`
- handlers y codigo route-owned en `app/controllers/`
- UI compartida en `app/ui/`
- helpers realmente transversales en `app/utils/`

### Evita estos anti-patrones

- crear `app/lib/` como cajon desastre
- crear `app/components/` si `app/ui/` ya cumple ese rol
- meter UI compartida dentro de `app/controllers/`
- llevar logica de middleware o persistencia a `app/utils/`

## Como pensar una nueva pagina

Ejemplo mental:

Quieres crear `/dashboard`.

Hazlo asi:

1. anade `dashboard` en `app/routes.ts`
2. conectala en `app/router.ts`
3. crea `app/controllers/dashboard.tsx`
4. renderiza HTML minimo
5. si mas tarde necesita acciones o submodulos, promovela a carpeta

## Como pensar auth

La ruta `/auth` ya existe como punto de arranque. Desde ahi puedes evolucionar hacia:

- login
- signup
- forgot password
- sesiones
- proteccion de rutas privadas

Cuando auth empiece a crecer, lo razonable es promocionar `app/controllers/auth.tsx` a una carpeta de controlador.

## Como pensar interactividad cliente

No empieces por JavaScript del navegador salvo que de verdad haga falta.

La regla buena es:

- primero una respuesta HTML correcta desde servidor
- despues hidratacion selectiva si mejora la UX

## Como empezar una integracion de datos

Cuando llegue el momento de persistir datos:

1. crea `app/data/`
2. define esquema y acceso a datos
3. valida input en el borde
4. conecta el controlador con esa capa

No mezcles validacion, acceso a datos y renderizado en el mismo bloque si la feature empieza a crecer.

## Checklist corto antes de cerrar una feature

- la ruta esta definida en un solo sitio
- el controlador devuelve la `Response` correcta
- la UI compartida no se ha duplicado
- la nueva logica vive en el owner correcto
- `npm run typecheck` pasa
- si aplica, `npm test` pasa

## Regla de oro

Este starter funciona mejor cuando resistes la tentacion de sobredisenarlo. Construye lo minimo correcto y deja que la estructura crezca con la necesidad real.