import { buildMountedHref } from "../routes/router-paths";
import classes from "./FixtureDirectory.module.css";

const groups = [
  {
    title: "Opening scenes",
    description: "Fixed-card previews from setup to the first turn.",
    items: [
      ["Alpha Clash · turn order and mulligan", "/alpha-clash/simulator/tests/opening-preview"],
      [
        "Grand Archive · Spirit reveal and opening hands",
        "/grand-archive/simulator/tests/opening-preview",
      ],
    ],
  },
  {
    title: "Card motions and play",
    description: "Inspect card movement, selection, play, and resolution.",
    items: [
      ["Alpha Clash · card motions", "/alpha-clash/simulator/tests/card-motions"],
      ["Alpha Clash · drag, play and resolve", "/alpha-clash/simulator/tests/play-preview"],
      ["Grand Archive · card motions", "/grand-archive/simulator/tests/card-motions"],
      ["Grand Archive · drag, play and resolve", "/grand-archive/simulator/tests/play-preview"],
    ],
  },
  {
    title: "Animations",
    description: "Shared visual recipes and game animation inventory.",
    items: [["Animation inventory", "/animation-fixtures"]],
  },
  {
    title: "Shared UI and interactions",
    description: "Connection states, clocks, prompts, and native game choices.",
    items: [
      ["Connection and clocks", "/simulator-ui-fixtures/connection-clocks"],
      ["Interactive prompts", "/simulator-ui-fixtures/interaction-prompt"],
      ["Interaction test inventory", "/simulator-ui-fixtures/interactions"],
      ["Cancelled match", "/simulator-ui-fixtures/cancelled-match"],
      [
        "Grand Archive · native interactions",
        "/simulator-ui-fixtures/game-interactions/grand-archive",
      ],
      [
        "Alpha Clash · native interactions",
        "/simulator-ui-fixtures/game-interactions/alpha-clash",
      ],
    ],
  },
  {
    title: "Tabletop components",
    description: "Compare cards, dice, counters, zones, and controls by game.",
    items: [["Component catalog", "/component-catalog"]],
  },
] as const;

export default function FixtureDirectory() {
  return (
    <div className={classes.directory}>
      {groups.map((group) => {
        const items = group.items;
        return (
          <section key={group.title} className={classes.group} aria-label={group.title}>
            <h2>{group.title}</h2>
            <p>{group.description}</p>
            <ul>
              {items.map(([label, route]) => (
                <li key={route}>
                  <a href={buildMountedHref(route)}>
                    {label}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
