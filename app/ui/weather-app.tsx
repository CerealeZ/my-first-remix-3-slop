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

export function WeatherLoadingPlaceholder() {
  return ({ city }: { city: string }) => (
    <section mix={css({ display: 'grid', gap: '24px' })}>
      <section
        aria-live="polite"
        mix={css({
          padding: '16px',
          borderRadius: '16px',
          background: '#ecfeff',
          color: '#155e75',
          border: '1px solid #a5f3fc',
        })}
      >
        Cargando el tiempo para <strong>{city}</strong>...
      </section>

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
            minHeight: '168px',
            padding: '24px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #cbd5e1, #e2e8f0)',
            display: 'grid',
            gap: '12px',
          })}
        >
          <PlaceholderLine width="42%" />
          <PlaceholderBlock height="64px" />
          <PlaceholderLine width="28%" />
        </article>

        <article
          mix={css({
            minHeight: '168px',
            padding: '24px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid #dbe4ea',
            display: 'grid',
            gap: '12px',
          })}
        >
          <PlaceholderLine width="38%" />
          <PlaceholderLine width="100%" />
          <PlaceholderLine width="100%" />
          <PlaceholderLine width="100%" />
        </article>
      </section>

      <section mix={css({ display: 'grid', gap: '12px' })}>
        <PlaceholderLine width="24%" />
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
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
        </div>
      </section>
    </section>
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

function PlaceholderCard() {
  return () => (
    <article
      mix={css({
        padding: '18px',
        borderRadius: '18px',
        background: '#ffffff',
        border: '1px solid #dbe4ea',
        display: 'grid',
        gap: '8px',
      })}
    >
      <PlaceholderLine width="52%" />
      <PlaceholderLine width="68%" />
      <PlaceholderLine width="48%" />
      <PlaceholderLine width="48%" />
    </article>
  )
}

function PlaceholderLine() {
  return ({ width }: { width: string }) => (
    <span
      aria-hidden="true"
      mix={css({
        display: 'block',
        height: '14px',
        borderRadius: '999px',
        background: 'linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb)',
        backgroundSize: '200% 100%',
        animation: 'weather-shimmer 1.4s linear infinite',
        '@keyframes weather-shimmer': {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      })}
      style={{ width }}
    />
  )
}

function PlaceholderBlock() {
  return ({ height }: { height: string }) => (
    <span
      aria-hidden="true"
      mix={css({
        display: 'block',
        width: '72%',
        borderRadius: '24px',
        background: 'linear-gradient(90deg, rgba(255,255,255,0.28), rgba(255,255,255,0.58), rgba(255,255,255,0.28))',
        backgroundSize: '200% 100%',
        animation: 'weather-shimmer-block 1.4s linear infinite',
        '@keyframes weather-shimmer-block': {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      })}
      style={{ height }}
    />
  )
}