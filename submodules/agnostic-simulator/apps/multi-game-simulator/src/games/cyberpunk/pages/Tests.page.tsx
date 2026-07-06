import { useEffect } from "react";
import { Link } from "react-router-dom";
import { listScenarios, SCENARIO_GROUPS } from "../engine";
import classes from "./Tests.module.css";
import { cyberpunkSimulatorPath } from "./simulatorPaths";

interface FixtureIndexProps {
  variant?: "home" | "dev";
}

export function FixtureIndex({ variant = "dev" }: FixtureIndexProps) {
  if (variant === "dev" && !import.meta.env.DEV) {
    return <NotFound />;
  }
  const scenarios = listScenarios();
  const isHome = variant === "home";

  const grouped = SCENARIO_GROUPS.map((group) => ({
    ...group,
    scenarios: scenarios.filter((s) => s.group === group.id),
  }));
  const activeGroups = grouped.filter((group) => group.scenarios.length > 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [variant]);

  return (
    <div className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <nav className={classes.breadcrumbs} aria-label="Fixture navigation">
            <a href="/" className={classes.breadcrumbLink}>
              All hubs
            </a>
            <span className={classes.breadcrumbCurrent}>Cyberpunk fixtures</span>
          </nav>
          <div className={classes.headerGrid}>
            <div>
              <p className={classes.eyebrow}>
                {isHome ? "Cyberpunk simulator" : "Dev fixture index"}
              </p>
              <h1 className={classes.title}>
                {isHome ? "Pick a board state" : "Cyberpunk route bench"}
              </h1>
              <p className={classes.lead}>
                {isHome
                  ? "Open a named engine state to inspect the board with its matching UI mode active."
                  : "Open a named engine state to verify view, action, and target selection modes."}
              </p>
            </div>
            <div className={classes.summary} aria-label="Fixture summary">
              <span className={classes.summaryItem}>
                <span className={classes.summaryValue}>{scenarios.length}</span>
                <span className={classes.summaryLabel}>Routes</span>
              </span>
              <span className={classes.summaryItem}>
                <span className={classes.summaryValue}>{activeGroups.length}</span>
                <span className={classes.summaryLabel}>Groups</span>
              </span>
              <span className={classes.summaryItem}>
                <span className={classes.summaryValue}>Dev</span>
                <span className={classes.summaryLabel}>Scope</span>
              </span>
            </div>
          </div>
        </header>
        {activeGroups.map((group) => (
          <section key={group.id} className={classes.group}>
            <div className={classes.groupHeader}>
              <h2 className={classes.groupTitle}>{group.label}</h2>
              <span className={classes.groupCount}>{group.scenarios.length}</span>
            </div>
            <ul className={classes.list}>
              {group.scenarios.map((scenario, index) => (
                <li key={scenario.id} className={classes.item}>
                  <Link
                    to={cyberpunkSimulatorPath(`/tests/${scenario.id}`)}
                    className={classes.link}
                  >
                    <span className={classes.index}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={classes.label}>{scenario.label}</span>
                    <span className={classes.path}>/tests/{scenario.id}</span>
                    <span className={classes.description}>{scenario.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {isHome && (
          <footer className={classes.footer}>
            <Link to={cyberpunkSimulatorPath("/practice")} className={classes.backLink}>
              Practice match
            </Link>
            <Link to={cyberpunkSimulatorPath("/tests")} className={classes.backLink}>
              Dev hub
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}

export function TestsPage() {
  return <FixtureIndex variant="dev" />;
}

export function HomePage() {
  return <FixtureIndex variant="home" />;
}

export function NotFound() {
  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <h1 className={classes.title}>404</h1>
        <p className={classes.lead}>Fixture not found.</p>
        <Link to={cyberpunkSimulatorPath("/tests")} className={classes.backLink}>
          Back to fixtures
        </Link>
      </header>
    </div>
  );
}
