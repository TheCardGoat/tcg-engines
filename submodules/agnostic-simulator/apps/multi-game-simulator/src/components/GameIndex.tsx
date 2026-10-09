import { useEffect, type CSSProperties } from "react";
import { getGameDefaultIndexPath, listIndexGames } from "../simulator/games";
import { buildMountedHref } from "../routes/router-paths.ts";
import classes from "./GameIndex.module.css";
import FixtureDirectory from "./FixtureDirectory";

export interface GameIndexProps {
  onNavigate: (path: string) => void;
}

export default function GameIndex({ onNavigate }: GameIndexProps) {
  useEffect(() => {
    document.title = "Multi-Game Simulator Harness";
  }, []);

  const games = listIndexGames();
  const hubCount = games.length + 5;
  const routeCount = games.length + 14;

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <aside className={classes.masthead} aria-label="Harness summary">
          <p className={classes.eyebrow}>Back office</p>
          <h1 className={classes.title}>Simulator fixture index</h1>
          <p className={classes.lead}>
            Opening scenes, card motions, shared UI, components, and game engine fixtures.
          </p>

          <div className={classes.metaGrid} aria-label="Harness status">
            <span className={classes.metaItem}>
              <span className={classes.metaValue}>{hubCount}</span>
              <span className={classes.metaLabel}>Hubs</span>
            </span>
            <span className={classes.metaItem}>
              <span className={classes.metaValue}>{routeCount}</span>
              <span className={classes.metaLabel}>Entrypoints</span>
            </span>
            <span className={classes.metaItem}>
              <span className={classes.metaValue}>Local</span>
              <span className={classes.metaLabel}>Runtime</span>
            </span>
            <span className={classes.metaItem}>
              <span className={classes.metaValue}>Dev</span>
              <span className={classes.metaLabel}>Access</span>
            </span>
          </div>

          <nav className={classes.rail} aria-label="Quick routes">
            <p className={classes.railLabel}>Quick routes</p>
            <ul className={classes.railList}>
              <li>
                <a className={classes.railLink} href={buildMountedHref("/animation-fixtures")}>
                  <span>Animation</span>
                  <span>/animation-fixtures</span>
                </a>
              </li>
              <li>
                <a className={classes.railLink} href={buildMountedHref("/simulator-ui-fixtures")}>
                  <span>Shared UI</span>
                  <span>/simulator-ui-fixtures</span>
                </a>
              </li>
              {games.map((game) => {
                const href = getGameDefaultIndexPath(game.slug) ?? `/${game.slug}`;
                return (
                  <li key={game.slug}>
                    <a className={classes.railLink} href={href}>
                      <span>{game.name}</span>
                      <span>{href.replace("/simulator/tests", "")}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <section className={classes.content} aria-label="Fixture hubs">
          <div className={classes.toolbar}>
            <h2 className={classes.toolbarTitle}>Fixture hubs</h2>
            <span className={classes.toolbarHint}>
              Open a hub, choose a state, inspect the board
            </span>
          </div>
          <FixtureDirectory />
          <h2 className={classes.toolbarTitle}>Game engine fixtures</h2>
          <ul className={classes.hubList}>
            {games.map((game) => {
              const href = getGameDefaultIndexPath(game.slug) ?? `/${game.slug}`;
              return (
                <li key={game.slug} className={classes.hubItem}>
                  <a
                    href={href}
                    className={classes.hubLink}
                    style={
                      {
                        "--row-accent": game.accentColor,
                        "--row-accent-soft": game.accentSoft,
                      } as CSSProperties
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(href);
                    }}
                  >
                    <span className={classes.hubIcon}>
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    </span>
                    <span className={classes.hubText}>
                      <span className={classes.hubName}>{game.name}</span>
                      <span className={classes.hubDescription}>{game.description}</span>
                    </span>
                    <span className={classes.hubBadge}>{game.badgeLabel}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </main>
  );
}
