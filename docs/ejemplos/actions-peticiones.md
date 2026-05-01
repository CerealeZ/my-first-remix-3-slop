# Actions Y Peticiones

## Idea base

Una action es la respuesta del servidor a una peticion que cambia estado o procesa input. Lo habitual es usar un formulario HTML y responder con:

- `400` si hay errores de validacion
- `303` si la operacion fue bien y toca redirigir

## Ejemplo de formulario GET + POST

### Definicion de rutas

Archivo sugerido: `app/routes.ts`

```ts
import { form, get, route } from 'remix/fetch-router/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: '/auth',
  contact: form('contact'),
})
```

### Wiring en el router

Archivo sugerido: `app/router.ts`

```ts
import { contact } from './controllers/contact.tsx'

router.map(routes.contact, contact)
```

### Controlador de la action

Archivo sugerido: `app/controllers/contact.tsx`

```tsx
import type { Controller } from 'remix/fetch-router'
import * as s from 'remix/data-schema'
import * as f from 'remix/data-schema/form-data'
import { email, minLength } from 'remix/data-schema/checks'
import { redirect } from 'remix/response/redirect'

import { Layout } from '../ui/layout.tsx'
import { routes } from '../routes.ts'
import { render } from '../utils/render.tsx'

let contactSchema = f.object({
  name: f.field(s.string().pipe(minLength(1))),
  email: f.field(s.string().pipe(email())),
  message: f.field(s.string().pipe(minLength(10))),
})

export const contact = {
  actions: {
    index({ request }) {
      return render(<ContactPage />, request)
    },

    async action({ request }) {
      let formData = await request.formData()
      let parsed = s.parseSafe(contactSchema, formData)

      if (!parsed.success) {
        return render(
          <ContactPage
            errors={parsed.issues}
            values={Object.fromEntries(formData)}
          />,
          request,
          { status: 400 },
        )
      }

      let { name, email, message } = parsed.value

      await sendContactEmail({ name, email, message })
      return redirect(routes.home.href(), 303)
    },
  },
} satisfies Controller<typeof routes.contact>

function ContactPage() {
  return ({
    errors = [],
    values = {},
  }: {
    errors?: Array<{ message: string }>
    values?: Record<string, FormDataEntryValue>
  }) => (
    <Layout title="Contact">
      <h1>Contact</h1>

      {errors.length > 0 ? (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error.message}</li>
          ))}
        </ul>
      ) : null}

      <form method="post">
        <input name="name" defaultValue={String(values.name ?? '')} />
        <input name="email" type="email" defaultValue={String(values.email ?? '')} />
        <textarea name="message">{String(values.message ?? '')}</textarea>
        <button type="submit">Send</button>
      </form>
    </Layout>
  )
}

async function sendContactEmail(input: { name: string; email: string; message: string }) {
  console.log('send contact email', input)
}
```

## Que aprender de este patron

- el GET dibuja el formulario
- el POST valida y procesa
- los errores vuelven como HTML util
- el exito termina en redirect

## Regla practica

No conviertas cada formulario en una API JSON por costumbre. Si el caso es un flujo normal de formulario, una action HTML con redirect suele ser la solucion mas limpia.