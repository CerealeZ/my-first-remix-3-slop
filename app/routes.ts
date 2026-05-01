import { get, route } from 'remix/fetch-router/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  auth: '/auth',
  weather: get('/weather'),
  weatherReport: get('/weather/report'),
})
