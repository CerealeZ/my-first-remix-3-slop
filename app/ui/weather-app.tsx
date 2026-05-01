import { css } from 'remix/ui'

import type { WeatherViewModel } from '../utils/weather.ts'

export function WeatherReportView() {
  return ({ report }: { report: WeatherViewModel }) => (
    <>
      <section
        mix={css({
          display: 'grid',
          gap: '16px',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(280px, 0.7fr)',
          '@media (max-width: 820px)': {
            gridTemplateColumns: '1fr',
          },
        })}
      >
        <article
          mix={css({
            padding: '24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0f766e, #0ea5e9)',
            color: '#ffffff',
            display: 'grid',
            gap: '10px',
          })}
        >
          <p mix={css({ margin: 0, opacity: 0.84, fontSize: '14px' })}>{report.locationName}</p>
          <div
            mix={css({
              display: 'flex',
              gap: '18px',
              alignItems: 'end',
              flexWrap: 'wrap',
            })}
          >
            <strong mix={css({ fontSize: '56px', lineHeight: '1' })}>
              {Math.round(report.current.temperature)} C
            </strong>
            <span mix={css({ fontSize: '18px', paddingBottom: '8px' })}>
              {report.current.weather}
            </span>
          </div>
        </article>

        <article
          mix={css({
            padding: '24px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid #dbe4ea',
            display: 'grid',
            gap: '12px',
          })}
        >
          <h2 mix={css({ margin: 0, fontSize: '20px' })}>Ahora mismo</h2>
          <MetricRow label="Sensacion termica" value={`${Math.round(report.current.apparentTemperature)} C`} />
          <MetricRow label="Viento" value={`${Math.round(report.current.windSpeed)} km/h`} />
          <MetricRow label="Estado" value={report.current.weather} />
        </article>
      </section>

      <section mix={css({ display: 'grid', gap: '12px' })}>
        <h2 mix={css({ margin: 0, fontSize: '24px' })}>Proximos dias</h2>
        <div
          mix={css({
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '12px',
            '@media (max-width: 720px)': {
              gridTemplateColumns: '1fr',
            },
          })}
        >
          {report.daily.map((entry) => (
            <article
              key={entry.dayLabel}
              mix={css({
                padding: '18px',
                borderRadius: '18px',
                background: '#ffffff',
                border: '1px solid #dbe4ea',
                display: 'grid',
                gap: '8px',
              })}
            >
              <strong>{entry.dayLabel}</strong>
              <span>{entry.weather}</span>
              <span>Min: {Math.round(entry.minTemperature)} C</span>
              <span>Max: {Math.round(entry.maxTemperature)} C</span>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function MetricRow() {
  return ({ label, value }: { label: string; value: string }) => (
    <div
      mix={css({
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        paddingTop: '10px',
        borderTop: '1px solid #e5e7eb',
      })}
    >
      <span mix={css({ color: '#6b7280' })}>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}