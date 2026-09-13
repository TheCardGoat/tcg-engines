import { Link } from "react-router-dom";
import { useSimulatorRoute } from "../../simulator/providers/route-context";
import { GRAND_ARCHIVE_VISUAL_FIXTURES } from "./fixtures";

export function GrandArchiveHomePage() {
  const route = useSimulatorRoute();
  const base = `/${route.gameSlug ?? "grand-archive"}/simulator`;

  return (
    <main className="ga-hub" data-testid="grand-archive-simulator-hub">
      <header className="ga-hub-hero">
        <p>Grand Archive simulator</p>
        <h1>Enter the arena</h1>
        <span>
          Play an engine-backed hotseat match or inspect deterministic states across Grand Archive's
          turn flow and viewer-private zones.
        </span>
      </header>

      <nav className="ga-hub-actions" aria-label="Grand Archive simulator modes">
        <Link to={`${base}/play/practice`} data-primary="true" data-testid="ga-home-practice">
          Start local practice
        </Link>
        <Link to={`${base}/tests`} data-testid="ga-home-fixtures">
          Open fixture catalog
        </Link>
      </nav>

      <section className="ga-hub-fixtures" aria-labelledby="ga-featured-fixtures">
        <header>
          <div>
            <p>Developer bench</p>
            <h2 id="ga-featured-fixtures">Featured engine states</h2>
          </div>
          <span>{GRAND_ARCHIVE_VISUAL_FIXTURES.length} fixtures</span>
        </header>
        <div className="ga-hub-fixture-grid">
          {GRAND_ARCHIVE_VISUAL_FIXTURES.slice(0, 4).map((fixture) => (
            <Link key={fixture.id} to={`${base}/tests/${fixture.id}`}>
              <span>{fixture.group.replace("-", " ")}</span>
              <strong>{fixture.name}</strong>
              <p>{fixture.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
