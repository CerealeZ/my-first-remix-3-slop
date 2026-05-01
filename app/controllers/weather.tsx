import type { BuildAction } from "remix/fetch-router";
import { Frame, css } from "remix/ui";
import { renderToString } from "remix/ui/server";

import { routes } from "../routes.ts";
import { Layout } from "../ui/layout.tsx";
import {
  WeatherLoadingPlaceholder,
  WeatherSearchForm,
} from "../assets/weather-form.tsx";
import { WeatherReportView } from "../ui/weather-app.tsx";
import type { WeatherViewModel } from "../utils/weather.ts";
import { loadWeather } from "../utils/weather.ts";
import { render } from "../utils/render.tsx";

export const weather: BuildAction<"GET", typeof routes.weather> = {
  handler({ request, url }) {
    let city = url.searchParams.get("city")?.trim() ?? "";
    let searchCity = city || "Madrid";

    return render(<WeatherPage city={searchCity} />, request);
  },
};

export const weatherReport: BuildAction<"GET", typeof routes.weatherReport> = {
  handler({ url }) {
    let city = url.searchParams.get("city")?.trim() ?? "";
    let searchCity = city || "Madrid";

    return streamWeatherReport(searchCity);
  },
};

function WeatherPage() {
  return ({ city }: { city: string }) => (
    <Layout title="Weather App">
      <section
        mix={css({
          maxWidth: "960px",
          margin: "0 auto",
          padding: "32px 20px 48px",
          display: "grid",
          gap: "24px",
        })}
      >
        <WeatherShell />
        <WeatherSearchForm
          city={city}
          weatherHref={routes.weather.href()}
          weatherReportHref={routes.weatherReport.href()}
        />
        <Frame
          name="weather-report"
          src={buildWeatherReportHref(city)}
          fallback={<WeatherLoadingPlaceholder city={city} />}
        />
      </section>
    </Layout>
  );
}

function WeatherShell() {
  return () => (
    <header
      mix={css({
        display: "grid",
        gap: "8px",
      })}
    >
      <p
        mix={css({
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: "12px",
          color: "#6b7280",
        })}
      >
        Streaming shell example
      </p>
      <h1 mix={css({ margin: 0, fontSize: "40px", lineHeight: "1.1" })}>
        Weather App
      </h1>
      <p
        mix={css({
          margin: 0,
          fontSize: "18px",
          color: "#4b5563",
          maxWidth: "70ch",
        })}
      >
        Esta ruta envia primero el shell de la pagina y deja que el bloque
        meteorologico llegue despues por streaming con un placeholder visible.
      </p>
    </header>
  );
}

function WeatherReportFrame() {
  return ({
    city,
    report,
    error,
  }: {
    city: string;
    report?: WeatherViewModel;
    error?: string;
  }) => (
    <section mix={css({ display: "grid", gap: "24px" })}>
      {error ? (
        <section
          mix={css({
            padding: "16px",
            borderRadius: "16px",
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          })}
        >
          <strong>No se pudo cargar el tiempo para {city}.</strong>
          <p mix={css({ margin: "8px 0 0" })}>{error}</p>
        </section>
      ) : null}

      {report ? <WeatherReportView report={report} /> : null}
    </section>
  );
}

function buildWeatherReportHref(city: string) {
  let reportUrl = new URL(routes.weatherReport.href(), "http://localhost");
  reportUrl.searchParams.set("city", city);
  return `${reportUrl.pathname}${reportUrl.search}`;
}

async function streamWeatherReport(city: string) {
  let html: string;

  try {
    let report = await loadWeather(city);
    html = await renderToString(
      <WeatherReportFrame city={city} report={report} />,
    );
  } catch (error) {
    let message =
      error instanceof Error ? error.message : "Unable to load weather data.";
    html = await renderToString(
      <WeatherReportFrame city={city} error={message} />,
    );
  }

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
