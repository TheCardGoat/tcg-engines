import { Link } from "react-router-dom";
import { listScenarios, SCENARIO_GROUPS } from "../engine";
import classes from "./Tests.module.css";

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

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <p className={classes.eyebrow}>
          {isHome ? "Cyberpunk · TCG simulator" : "Dev only · scenarios"}
        </p>
        <h1 className={classes.title}>
          {isHome ? "Pick a board state" : "Cyberpunk simulator · fixture routes"}
        </h1>
        <p className={classes.lead}>
          {isHome
            ? "Each scenario boots the engine into a named state. Open one to step into the board with the corresponding UI mode active."
            : "Each row links to a route that boots the engine into the named state. Use these to verify the board's visual modes (view / select-action / select-target) without playing into them."}
        </p>
      </header>
      {grouped.map((group) =>
        group.scenarios.length > 0 ? (
          <section key={group.id} className={classes.group}>
            <h2 className={classes.groupTitle}>{group.label}</h2>
            <ul className={classes.list}>
              {group.scenarios.map((scenario) => (
                <li key={scenario.id} className={classes.item}>
                  <Link to={`/tests/${scenario.id}`} className={classes.link}>
                    <span className={classes.label}>{scenario.label}</span>
                    <span className={classes.path}>/tests/{scenario.id}</span>
                    <span className={classes.description}>{scenario.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}
      {isHome && (
        <footer className={classes.footer}>
          <Link to="/practice" className={classes.backLink}>
            Practice match →
          </Link>
          <Link to="/tests" className={classes.backLink}>
            Dev hub →
          </Link>
        </footer>
      )}
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
        <Link to="/tests" className={classes.backLink}>
          ← Back to fixtures
        </Link>
      </header>
    </div>
  );
}
