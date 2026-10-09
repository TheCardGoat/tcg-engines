import { lazy, Suspense, useEffect, useState } from "react";
import GameCatalog from "./component-catalog/GameCatalog";
import ComponentInventory from "./component-catalog/ComponentInventory";
import { GAMES, isGameSlug } from "../simulator/games";
import { buildMountedHref } from "../routes/router-paths";
import classes from "./ComponentCatalogPage.module.css";

const CyberpunkComponentCatalog = lazy(
  () => import("../games/cyberpunk/components/BoardV2/ComponentCatalog"),
);

const categories = [
  "All components",
  "Cards",
  "Dice",
  "Counters",
  "Zones",
  "Controls",
  "Inventory",
  "Production board",
] as const;
type Category = (typeof categories)[number];
function initialGame() {
  const game = new URLSearchParams(window.location.search).get("game");
  return game === "all" || (game && game !== "lorcana" && isGameSlug(game)) ? game : "cyberpunk";
}

export default function ComponentCatalogPage() {
  const [mounted, setMounted] = useState(false);
  const [game, setGame] = useState("cyberpunk");
  const [category, setCategory] = useState<Category>("All components");
  useEffect(() => {
    setMounted(true);
    setGame(initialGame());
    document.title = "Tabletop component catalog";
  }, []);
  const games = GAMES.filter(
    (candidate) => candidate.slug !== "lorcana" && (game === "all" || candidate.slug === game),
  );
  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <p className={classes.eyebrow}>Simulator library</p>
        <h1>Tabletop component catalog</h1>
        <p>Inspect production components with the game’s existing fixture data.</p>
        <nav className={classes.links} aria-label="Fixture routes">
          <a href={buildMountedHref("/simulator-ui-fixtures")}>All fixtures</a>
          <a href={buildMountedHref("/simulator-ui-fixtures/connection-clocks")}>
            Connection and clocks
          </a>
          <a href={buildMountedHref("/simulator-ui-fixtures/interaction-prompt")}>
            Interactive prompts
          </a>
          <a href={buildMountedHref("/simulator-ui-fixtures/interactions")}>
            Interaction test inventory
          </a>
          <a href={buildMountedHref("/animation-fixtures")}>Animations</a>
        </nav>
      </header>
      <div className={classes.filters}>
        <label>
          Game
          <select
            value={game}
            onChange={(event) => {
              const next = event.target.value;
              setGame(next);
              const url = new URL(window.location.href);
              url.searchParams.set("game", next);
              window.history.replaceState({}, "", url);
            }}
          >
            <option value="all">All games · compare</option>
            {GAMES.filter((item) => item.slug !== "lorcana").map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Component family
          <select
            value={category}
            onChange={(event) => {
              const next = categories.find((item) => item === event.target.value);
              if (next) setCategory(next);
            }}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <p>
          {games.length} {games.length === 1 ? "game" : "games"} · production component views
        </p>
      </div>
      {category === "Inventory" && (
        <ComponentInventory
          game={game}
          onPreview={(nextGame, nextFamily) => {
            const next = categories.find((item) => item === nextFamily);
            if (next) setCategory(next);
            setGame(nextGame);
            const url = new URL(window.location.href);
            url.searchParams.set("game", nextGame);
            window.history.replaceState({}, "", url);
          }}
        />
      )}
      <div className={classes.catalog}>
        {games.map((item) => (
          <section
            key={item.slug}
            data-game={item.slug}
            className={classes.game}
            data-production
            aria-label={`${item.name} components`}
          >
            <header className={classes.gameHeader}>
              <h2>{item.name}</h2>
              <span>
                {item.slug === "cyberpunk"
                  ? "Production V1 / V2 components"
                  : "Production components"}
              </span>
            </header>
            {category !== "Inventory" &&
              (item.slug === "cyberpunk"
                ? mounted && (
                    <Suspense fallback={<p role="status">Loading Cyberpunk components…</p>}>
                      <CyberpunkComponentCatalog category={category} />
                    </Suspense>
                  )
                : mounted && <GameCatalog game={item.slug} category={category} />)}
          </section>
        ))}
      </div>
    </main>
  );
}
