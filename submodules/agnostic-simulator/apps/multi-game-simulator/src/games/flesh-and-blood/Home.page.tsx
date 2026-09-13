import { Link } from "react-router-dom";

import { FAB_VISUAL_FIXTURES } from "./fixtures";
import { useSimulatorRoute } from "../../simulator/providers/route-context";
import "./flesh-and-blood.css";

/**
 * `/flesh-and-blood/simulator` hub — mirrors other games' simulator landing:
 * primary play entry + fixture bench entry, with a short fixture preview list.
 */
export function FleshAndBloodHomePage() {
  const route = useSimulatorRoute();
  const base = `/${route.gameSlug ?? "flesh-and-blood"}/simulator`;
  const preview = FAB_VISUAL_FIXTURES.slice(0, 6);

  return (
    <main
      className="fab-hub"
      data-testid="fab-simulator-hub"
      style={{
        minHeight: "100svh",
        padding: "clamp(1.25rem, 4vw, 3rem)",
        background:
          "radial-gradient(ellipse at 10% 0%, rgba(138,28,28,0.28), transparent 40%), #0f0a0a",
        color: "#fef2f2",
      }}
    >
      <header style={{ maxWidth: 720, marginBottom: "1.75rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(251,191,36,0.75)",
          }}
        >
          Flesh &amp; Blood simulator
        </p>
        <h1 style={{ margin: "0.4rem 0 0", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800 }}>
          Playmat hub
        </h1>
        <p style={{ margin: "0.65rem 0 0", opacity: 0.72, maxWidth: 520, lineHeight: 1.5 }}>
          Engine-backed practice against bots, or open deterministic visual fixtures for combat
          stages, permanents, and mobile shared-arena review.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <Link
          to={`${base}/play/practice`}
          className="rounded-lg px-5 py-3 text-sm font-semibold text-white"
          style={{ background: "#8a1c1c", textDecoration: "none", minHeight: 44 }}
          data-testid="fab-home-practice"
        >
          Practice vs bot
        </Link>
        <Link
          to={`${base}/tests`}
          className="rounded-lg border px-5 py-3 text-sm font-semibold"
          style={{
            borderColor: "rgba(196,163,90,0.45)",
            color: "#fef2f2",
            textDecoration: "none",
            minHeight: 44,
          }}
          data-testid="fab-home-fixtures"
        >
          Fixture catalog
        </Link>
        <Link
          to={`${base}/practice`}
          className="rounded-lg border px-5 py-3 text-sm font-semibold"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
            color: "rgba(254,242,242,0.8)",
            textDecoration: "none",
            minHeight: 44,
          }}
          data-testid="fab-home-practice-alias"
        >
          Practice (alias)
        </Link>
      </div>

      <section aria-labelledby="fab-hub-fixtures-heading" style={{ maxWidth: 720 }}>
        <h2
          id="fab-hub-fixtures-heading"
          style={{
            margin: "0 0 0.75rem",
            fontSize: 13,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(251,191,36,0.8)",
          }}
        >
          Featured fixtures · {FAB_VISUAL_FIXTURES.length} total
        </h2>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: "0.55rem",
          }}
        >
          {preview.map((fixture) => (
            <li key={fixture.id}>
              <Link
                to={`${base}/tests/${fixture.id}`}
                data-testid={`fab-home-fixture-${fixture.id}`}
                style={{
                  display: "block",
                  padding: "0.75rem 0.9rem",
                  borderRadius: 10,
                  border: "1px solid rgba(196,163,90,0.28)",
                  background: "rgba(26,18,18,0.85)",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                <strong style={{ display: "block", fontSize: 14 }}>{fixture.label}</strong>
                <span style={{ fontSize: 12, opacity: 0.65 }}>{fixture.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p style={{ marginTop: "0.85rem" }}>
          <Link
            to={`${base}/tests`}
            style={{ color: "#fecaca", fontWeight: 700, fontSize: 13 }}
            data-testid="fab-home-all-fixtures"
          >
            Browse full catalog →
          </Link>
        </p>
      </section>
    </main>
  );
}
