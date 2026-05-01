export type WeatherViewModel = {
  locationName: string
  current: {
    temperature: number
    apparentTemperature: number
    windSpeed: number
    weather: string
  }
  daily: Array<{
    dayLabel: string
    minTemperature: number
    maxTemperature: number
    weather: string
  }>
}

type GeocodingResponse = {
  results?: Array<{
    name: string
    country?: string
    admin1?: string
    latitude: number
    longitude: number
  }>
}

type ForecastResponse = {
  current?: {
    temperature_2m: number
    apparent_temperature: number
    wind_speed_10m: number
    weather_code: number
  }
  daily?: {
    time: string[]
    weather_code: number[]
    temperature_2m_min: number[]
    temperature_2m_max: number[]
  }
}

export async function loadWeather(city: string): Promise<WeatherViewModel> {
  let geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search')
  geoUrl.searchParams.set('name', city)
  geoUrl.searchParams.set('count', '1')
  geoUrl.searchParams.set('language', 'es')
  geoUrl.searchParams.set('format', 'json')

  let geoResponse = await fetch(geoUrl, {
    headers: { accept: 'application/json' },
  })
  if (!geoResponse.ok) {
    throw new Error('The geocoding service returned an error.')
  }

  let geoJson = (await geoResponse.json()) as GeocodingResponse
  let place = geoJson.results?.[0]
  if (!place) {
    throw new Error(`No se encontro la ciudad "${city}".`)
  }

  let forecastUrl = new URL('https://api.open-meteo.com/v1/forecast')
  forecastUrl.searchParams.set('latitude', String(place.latitude))
  forecastUrl.searchParams.set('longitude', String(place.longitude))
  forecastUrl.searchParams.set('current', 'temperature_2m,apparent_temperature,wind_speed_10m,weather_code')
  forecastUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min')
  forecastUrl.searchParams.set('timezone', 'auto')
  forecastUrl.searchParams.set('forecast_days', '3')

  let forecastResponse = await fetch(forecastUrl, {
    headers: { accept: 'application/json' },
  })
  if (!forecastResponse.ok) {
    throw new Error('The forecast service returned an error.')
  }

  let forecastJson = (await forecastResponse.json()) as ForecastResponse
  if (!forecastJson.current || !forecastJson.daily) {
    throw new Error('Open-Meteo returned an incomplete forecast payload.')
  }

  let daily = forecastJson.daily

  return {
    locationName: [place.name, place.admin1, place.country].filter(Boolean).join(', '),
    current: {
      temperature: forecastJson.current.temperature_2m,
      apparentTemperature: forecastJson.current.apparent_temperature,
      windSpeed: forecastJson.current.wind_speed_10m,
      weather: getWeatherLabel(forecastJson.current.weather_code),
    },
    daily: daily.time.map((date, index) => ({
      dayLabel: formatDayLabel(date),
      minTemperature: daily.temperature_2m_min[index] ?? 0,
      maxTemperature: daily.temperature_2m_max[index] ?? 0,
      weather: getWeatherLabel(daily.weather_code[index] ?? -1),
    })),
  }
}

function formatDayLabel(date: string) {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${date}T12:00:00`))
}

function getWeatherLabel(code: number) {
  let labels: Record<number, string> = {
    0: 'Despejado',
    1: 'Mayormente despejado',
    2: 'Parcialmente nuboso',
    3: 'Cubierto',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso',
  }

  return labels[code] ?? 'Condicion no disponible'
}