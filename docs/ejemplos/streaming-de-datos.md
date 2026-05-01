# Streaming De Datos

## Idea base

El streaming en este framework encaja muy bien con `Frame`. La pagina principal puede responder rapido con su estructura base y una parte secundaria se carga mas tarde.

## Cuadro mental

- sin `fallback`: el servidor espera y bloquea esa parte
- con `fallback`: el servidor envia HTML inicial y luego reemplaza el placeholder cuando llega el contenido real

## Ejemplo de dashboard con panel en streaming

### Rutas

Archivo sugerido: `app/routes.ts`

```ts
import { get, route } from 'remix/fetch-router/routes'

export const routes = route({
  dashboard: '/dashboard',
  salesPanel: get('/dashboard/sales-panel'),
})
```

### Pagina principal

Archivo sugerido: `app/controllers/dashboard.tsx`

```tsx
import type { BuildAction } from 'remix/fetch-router'
import { Frame } from 'remix/ui'

import type { routes } from '../routes.ts'
import { Layout } from '../ui/layout.tsx'
import { render } from '../utils/render.tsx'

export const dashboard: BuildAction<'GET', typeof routes.dashboard> = {
  handler({ request }) {
    return render(<DashboardPage />, request)
  },
}

function DashboardPage() {
  return () => (
    <Layout title="Dashboard">
      <h1>Dashboard</h1>
      <p>Esta parte llega en la primera respuesta HTML.</p>

      <Frame
        name="sales-panel"
        src={routes.salesPanel.href()}
        fallback={<SalesPanelSkeleton />}
      />
    </Layout>
  )
}

function SalesPanelSkeleton() {
  return () => <p>Loading sales panel...</p>
}
```

### Panel que llega despues

Archivo sugerido: `app/controllers/sales-panel.tsx`

```tsx
import type { BuildAction } from 'remix/fetch-router'

import type { routes } from '../routes.ts'
import { render } from '../utils/render.tsx'

export const salesPanel: BuildAction<'GET', typeof routes.salesPanel> = {
  async handler({ request }) {
    let report = await loadSalesReport()
    return render(<SalesPanel report={report} />, request)
  },
}

function SalesPanel() {
  return ({ report }: { report: { today: number; month: number } }) => (
    <section>
      <h2>Sales panel</h2>
      <p>Today: {report.today}</p>
      <p>This month: {report.month}</p>
    </section>
  )
}

async function loadSalesReport() {
  return {
    today: 12,
    month: 284,
  }
}
```

## Que gana este patron

- la shell principal responde rapido
- el contenido lento no bloquea todo
- la logica de render sigue viviendo en el servidor

## Regla practica

Usa streaming para regiones lentas o secundarias. No lo metas por sistema en cada pagina, porque tambien complica la lectura y el debugging.