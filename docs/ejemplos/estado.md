# Estado

## Idea base

El estado local en Remix UI vive como variables normales dentro de la fase de setup del componente. Cuando cambias ese estado, llamas a `handle.update()`.

## Ejemplo 1: estado local de un contador

Archivo sugerido: `app/ui/counter.tsx`

```tsx
import { clientEntry, on, type Handle } from 'remix/ui'

export const Counter = clientEntry(
  import.meta.url,
  function Counter(handle: Handle<{ initialCount?: number; label?: string }>) {
    let count = handle.props.initialCount ?? 0

    return () => (
      <button
        mix={on('click', () => {
          count++
          handle.update()
        })}
      >
        {handle.props.label ?? 'Count'}: {count}
      </button>
    )
  },
)
```

## Lo importante aqui

- `count` es una variable normal
- no hay hooks
- `handle.update()` fuerza el rerender

## Ejemplo 2: estado compartido con contexto

```tsx
import { on, type Handle, type RemixNode } from 'remix/ui'

export function ThemeProvider(
  handle: Handle<{ children?: RemixNode }, { theme: 'light' | 'dark' }>,
) {
  let theme: 'light' | 'dark' = 'light'
  handle.context.set({ theme })

  return () => (
    <section>
      <button
        mix={on('click', () => {
          theme = theme === 'light' ? 'dark' : 'light'
          handle.context.set({ theme })
          handle.update()
        })}
      >
        Toggle theme
      </button>

      {handle.props.children}
    </section>
  )
}

export function ThemeLabel(handle: Handle) {
  let { theme } = handle.context.get(ThemeProvider)
  return () => <p>Theme: {theme}</p>
}
```

## Cuando usar cada tipo de estado

- estado local: para una sola pieza interactiva
- contexto: para compartir estado entre varios descendientes

## Regla practica

Guarda solo el minimo estado que afecte al render. Lo derivado, calculalo durante el render.