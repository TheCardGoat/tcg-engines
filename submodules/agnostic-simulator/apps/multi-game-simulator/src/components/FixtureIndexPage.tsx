import FixtureDirectory from "./FixtureDirectory";
import classes from "./FixtureDirectory.module.css";

export default function FixtureIndexPage() {
  return (
    <main className={classes.page}>
      <header>
        <p>Simulator library</p>
        <h1>Simulator fixture index</h1>
        <p>Choose opening scenes, card motions, animations, shared UI, or tabletop components.</p>
      </header>
      <FixtureDirectory />
    </main>
  );
}
