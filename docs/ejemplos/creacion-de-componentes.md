# Creacion De Componentes

## Idea base

En este framework un componente no se piensa como un componente React con hooks. Lo normal es escribir una funcion que devuelve otra funcion de render.

## Ejemplo simple de componente compartido

Archivo sugerido: `app/ui/user-card.tsx`

```tsx
import type { RemixNode } from 'remix/ui'
import { css } from 'remix/ui'

interface UserCardProps {
  name: string
  email: string
  actions?: RemixNode
}

export function UserCard() {
  return ({ name, email, actions }: UserCardProps) => (
    <article
      mix={css({
        padding: '16px',
        border: '1px solid #d0d7de',
        borderRadius: '12px',
        display: 'grid',
        gap: '8px',
        background: '#ffffff',
      })}
    >
      <strong>{name}</strong>
      <span>{email}</span>
      {actions}
    </article>
  )
}
```

## Uso desde una pagina

```tsx
import { Layout } from '../ui/layout.tsx'
import { UserCard } from '../ui/user-card.tsx'

function UsersPage() {
  return () => (
    <Layout title="Users">
      <h1>Users</h1>
      <UserCard name="Ada Lovelace" email="ada@example.com" />
      <UserCard name="Grace Hopper" email="grace@example.com" />
    </Layout>
  )
}
```

## Cuando ponerlo en `app/ui/`

Llevalo a `app/ui/` cuando el componente vaya a ser reutilizado por varias rutas.

Si solo lo usa una ruta concreta, dejalo junto a su controlador.

## Regla practica

Si el componente solo renderiza con props y no necesita estado local, mantenlo asi de simple. No anadas complejidad hasta que haga falta.