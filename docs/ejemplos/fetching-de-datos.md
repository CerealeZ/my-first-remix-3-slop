# Fetching De Datos

## Idea base

En este starter hay dos patrones sanos para traer datos:

- fetching en el servidor dentro del controlador
- fetching en el cliente solo cuando la interactividad lo exige

El primer patron debe ser tu opcion por defecto.

## Ejemplo 1: fetching en el servidor

Archivo sugerido: `app/controllers/weather.tsx`

```tsx
import type { BuildAction } from 'remix/fetch-router'

import type { routes } from '../routes.ts'
import { Layout } from '../ui/layout.tsx'
import { render } from '../utils/render.tsx'

interface WeatherResponse {
  city: string
  temperature: number
  summary: string
}

export const weather: BuildAction<'GET', typeof routes.weather> = {
  async handler({ request, url }) {
    let city = url.searchParams.get('city') ?? 'Madrid'

    let response = await fetch(`https://api.example.com/weather?city=${encodeURIComponent(city)}`)
    if (!response.ok) {
      return new Response('Weather service unavailable', { status: 502 })
    }

    let weather = (await response.json()) as WeatherResponse
    return render(<WeatherPage city={city} weather={weather} />, request)
  },
}

function WeatherPage() {
  return ({ city, weather }: { city: string; weather: WeatherResponse }) => (
    <Layout title="Weather">
      <h1>Weather for {city}</h1>
      <p>{weather.summary}</p>
      <p>{weather.temperature} C</p>
    </Layout>
  )
}
```

### Por que este patron suele ser el mejor

- la pagina ya sale completa desde el servidor
- no depende de hidratacion para mostrar datos
- el navegador recibe HTML util desde el primer request

## Ejemplo 2: fetching en el cliente para busqueda interactiva

Archivo sugerido: `app/ui/search-box.tsx`

```tsx
import { clientEntry, on, type Handle } from 'remix/ui'

interface SearchResult {
  id: string
  title: string
}

export const SearchBox = clientEntry(
  import.meta.url,
  function SearchBox(handle: Handle) {
    let query = ''
    let loading = false
    let results: SearchResult[] = []

    return () => (
      <section>
        <input
          type="search"
          placeholder="Search..."
          mix={on('input', async (event, signal) => {
            query = event.currentTarget.value
            loading = true
            handle.update()

            let response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal })
            let json = (await response.json()) as { results: SearchResult[] }
            if (signal.aborted) return

            results = json.results
            loading = false
            handle.update()
          })}
        />

        {loading ? <p>Loading...</p> : null}

        <ul>
          {results.map((result) => (
            <li key={result.id}>{result.title}</li>
          ))}
        </ul>
      </section>
    )
  },
)
```

### Cuando merece la pena este patron

Usalo para autocomplete, filtros vivos o widgets pequenos donde esperar a un submit completo empeora la experiencia.

## Regla practica

Si el dato es necesario para renderizar la pagina principal, traelo en el servidor. Si el dato responde a una interaccion del usuario ya en el navegador, entonces valora fetching cliente.