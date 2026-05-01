# Primeros Pasos

## Objetivo

Esta guia sirve para arrancar el proyecto, entender su forma base y hacer el primer cambio sin pelearte con la estructura.

## Requisitos

- Node.js `>= 24.3.0`
- npm

## Instalacion

Desde la raiz del proyecto:

```sh
npm i
```

## Arranque en local

Para iniciar el servidor:

```sh
npm run start
```

El servidor queda escuchando por defecto en:

```txt
http://localhost:44100
```

Si necesitas otro puerto:

```sh
PORT=4500 npm run start
```

En Windows PowerShell:

```powershell
$env:PORT=4500; npm run start
```

## Scripts utiles

```sh
npm run start
npm run dev
npm test
npm run typecheck
```

Que hace cada uno:

- `npm run start`: ejecuta el servidor normal.
- `npm run dev`: reinicia el servidor al detectar cambios.
- `npm test`: ejecuta los tests con `tsx --test`.
- `npm run typecheck`: valida TypeScript sin generar salida.

## Que vas a ver al abrir la app

El starter trae dos rutas listas:

- `/`: home page de ejemplo
- `/auth`: pagina base para empezar login, signup y sesiones

Tambien expone una ruta de assets bajo `/assets/*` para cargar modulos del navegador.

## Mapa mental rapido

- `app/routes.ts`: define las URLs del sistema.
- `app/router.ts`: conecta cada ruta con su handler.
- `app/controllers/`: contiene la logica de cada pagina o endpoint.
- `app/ui/`: contiene piezas de UI compartidas.
- `app/utils/render.tsx`: convierte la UI en una `Response` HTML.
- `server.ts`: arranca el servidor Node.

## Primer cambio recomendado

Si quieres comprobar que entiendes la estructura, haz este recorrido:

1. Cambia el contenido de `app/controllers/home.tsx`.
2. Si el cambio es de layout compartido, toca `app/ui/layout.tsx`.
3. Si necesitas una nueva URL, empieza por `app/routes.ts` y luego conectala en `app/router.ts`.

## Forma correcta de crecer

La idea de este starter es crecer desde lo mas pequeno:

- empieza con archivos planos en `app/controllers/`
- convierte una ruta en carpeta solo cuando tenga subrutas, multiples acciones o modulos propios
- mueve UI compartida a `app/ui/`
- crea `app/data/`, `app/middleware/`, `public/` o `test/` solo cuando realmente hagan falta

## Si vienes de React tradicional

Aqui hay una diferencia importante: la UI usa `remix/ui`, no React. Eso implica que:

- la app sigue siendo server-first
- el render del servidor es la base del comportamiento
- la hidratacion del navegador se agrega solo cuando hace falta

## Siguiente lectura recomendada

Despues de arrancar el proyecto, sigue con [capacidades-del-framework.md](./capacidades-del-framework.md).