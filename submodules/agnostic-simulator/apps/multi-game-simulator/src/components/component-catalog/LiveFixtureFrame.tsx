import type { ReactNode } from "react";
import classes from "./LiveFixtures.module.css";
export function LiveFixtureFrame({
  title,
  components,
  children,
}: {
  title: string;
  components: readonly string[];
  children: ReactNode;
}) {
  return (
    <section
      className={classes.fixture}
      data-catalog-components={components.join(" ")}
      aria-label={title}
    >
      <h4>{title}</h4>
      <p className={classes.source}>{components.join(" · ")}</p>
      {children}
    </section>
  );
}
