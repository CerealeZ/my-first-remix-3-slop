import {
  clientEntry,
  css,
  on,
  type Handle,
  type SerializableProps,
} from "remix/ui";

interface WeatherSearchFormProps extends SerializableProps {
  city: string;
  weatherHref: string;
  weatherReportHref: string;
}

export const WeatherSearchForm = clientEntry(
  import.meta.url,
  function WeatherSearchForm(handle: Handle<WeatherSearchFormProps>) {
    return () => (
      <form
        method="get"
        action={handle.props.weatherHref}
        mix={[
          css({
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: "12px",
            padding: "16px",
            border: "1px solid #d1d5db",
            borderRadius: "16px",
            background: "#f9fafb",
            "@media (max-width: 720px)": {
              gridTemplateColumns: "1fr",
            },
          }),
          on("submit", async (event, signal) => {
            event.preventDefault();

            let form = event.currentTarget;
            let formData = new FormData(form);
            let nextCity =
              String(formData.get("city") ?? "").trim() || "Madrid";
            let cityInput = form.elements.namedItem("city");

            if (cityInput instanceof HTMLInputElement) {
              cityInput.value = nextCity;
            }

            let frame = handle.frames.get("weather-report");
            if (!frame) return;

            frame.src = buildWeatherReportHref(
              handle.props.weatherReportHref,
              nextCity,
            );
            await frame.replace(<WeatherLoadingPlaceholder city={nextCity} />);
            if (signal.aborted) return;

            await frame.reload();
          }),
        ]}
      >
        <label mix={css({ display: "grid", gap: "8px" })}>
          <span mix={css({ fontWeight: 700 })}>Ciudad</span>
          <input
            type="search"
            name="city"
            defaultValue={handle.props.city}
            placeholder="Madrid"
            mix={css({
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #9ca3af",
              font: "inherit",
              background: "#ffffff",
            })}
          />
        </label>

        <button
          type="submit"
          mix={css({
            alignSelf: "end",
            padding: "12px 18px",
            border: 0,
            borderRadius: "12px",
            background: "#0f766e",
            color: "#ffffff",
            font: "inherit",
            fontWeight: 700,
            cursor: "pointer",
          })}
        >
          Buscar
        </button>
      </form>
    );
  },
);

function buildWeatherReportHref(weatherReportHref: string, city: string) {
  let reportUrl = new URL(weatherReportHref, "http://localhost");
  reportUrl.searchParams.set("city", city);
  return `${reportUrl.pathname}${reportUrl.search}`;
}

export function WeatherLoadingPlaceholder() {
  return ({ city }: { city: string }) => (
    <section mix={css({ display: "grid", gap: "24px" })}>
      <section
        aria-live="polite"
        mix={css({
          padding: "16px",
          borderRadius: "16px",
          background: "#ecfeff",
          color: "#155e75",
          border: "1px solid #a5f3fc",
        })}
      >
        Cargando el tiempo para <strong>{city}</strong>...
      </section>

      <section
        mix={css({
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.7fr)",
          "@media (max-width: 820px)": {
            gridTemplateColumns: "1fr",
          },
        })}
      >
        <article
          mix={css({
            minHeight: "168px",
            padding: "24px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #cbd5e1, #e2e8f0)",
            display: "grid",
            gap: "12px",
          })}
        >
          <PlaceholderLine width="42%" />
          <PlaceholderBlock height="64px" />
          <PlaceholderLine width="28%" />
        </article>

        <article
          mix={css({
            minHeight: "168px",
            padding: "24px",
            borderRadius: "20px",
            background: "#ffffff",
            border: "1px solid #dbe4ea",
            display: "grid",
            gap: "12px",
          })}
        >
          <PlaceholderLine width="38%" />
          <PlaceholderLine width="100%" />
          <PlaceholderLine width="100%" />
          <PlaceholderLine width="100%" />
        </article>
      </section>

      <section mix={css({ display: "grid", gap: "12px" })}>
        <PlaceholderLine width="24%" />
        <div
          mix={css({
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            "@media (max-width: 720px)": {
              gridTemplateColumns: "1fr",
            },
          })}
        >
          <PlaceholderCard />
          <PlaceholderCard />
          <PlaceholderCard />
        </div>
      </section>
    </section>
  );
}

function PlaceholderCard() {
  return () => (
    <article
      mix={css({
        padding: "18px",
        borderRadius: "18px",
        background: "#ffffff",
        border: "1px solid #dbe4ea",
        display: "grid",
        gap: "8px",
      })}
    >
      <PlaceholderLine width="52%" />
      <PlaceholderLine width="68%" />
      <PlaceholderLine width="48%" />
      <PlaceholderLine width="48%" />
    </article>
  );
}

function PlaceholderLine() {
  return ({ width }: { width: string }) => (
    <span
      aria-hidden="true"
      mix={css({
        display: "block",
        height: "14px",
        borderRadius: "999px",
        background: "linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb)",
        backgroundSize: "200% 100%",
        animation: "weather-shimmer 1.4s linear infinite",
        "@keyframes weather-shimmer": {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      })}
      style={{ width }}
    />
  );
}

function PlaceholderBlock() {
  return ({ height }: { height: string }) => (
    <span
      aria-hidden="true"
      mix={css({
        display: "block",
        width: "72%",
        borderRadius: "24px",
        background:
          "linear-gradient(90deg, rgba(255,255,255,0.28), rgba(255,255,255,0.58), rgba(255,255,255,0.28))",
        backgroundSize: "200% 100%",
        animation: "weather-shimmer-block 1.4s linear infinite",
        "@keyframes weather-shimmer-block": {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      })}
      style={{ height }}
    />
  );
}
