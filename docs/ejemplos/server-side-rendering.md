# Server Side Rendering

## Idea base

En este proyecto el render del servidor es la ruta principal, no un extra. El controlador prepara los datos y devuelve una `Response` HTML.

## Flujo de SSR en este starter

1. `server.ts` recibe el request.
2. `app/router.ts` decide que controlador debe responder.
3. El controlador llama a `render(...)`.
4. `app/utils/render.tsx` usa `renderToStream(...)` para producir HTML.

## Ejemplo minimo

Archivo sugerido: `app/controllers/dashboard.tsx`

```tsx
import type { BuildAction } from 'remix/fetch-router'

import type { routes } from '../routes.ts'
import { Layout } from '../ui/layout.tsx'
import { render } from '../utils/render.tsx'

interface DashboardStats {
  totalUsers: number
  totalOrders: number
}

export const dashboard: BuildAction<'GET', typeof routes.dashboard> = {
  async handler({ request }) {
    let stats: DashboardStats = {
      totalUsers: 128,
      totalOrders: 43,
    }

    return render(<DashboardPage stats={stats} />, request)
  },
}

function DashboardPage() {
  return ({ stats }: { stats: DashboardStats }) => (
    <Layout title="Dashboard">
      <h1>Dashboard</h1>
      <p>Total users: {stats.totalUsers}</p>
      <p>Total orders: {stats.totalOrders}</p>
    </Layout>
  )
}
```

## Que lo convierte en SSR de verdad

- los datos se resuelven antes de devolver HTML
- el navegador recibe la pagina ya renderizada
- no hace falta esperar a JavaScript para ver el contenido principal

## Cuando anadir hidratacion

Solo cuando una parte de la pagina necesite interaccion real en cliente, por ejemplo:

- un contador
- filtros en vivo
- una caja de busqueda con resultados inmediatos

## Regla practica

Piensa el SSR como el contrato base de la ruta. Si la pagina no funciona bien con SSR solo, todavia no esta lista para capas de cliente.