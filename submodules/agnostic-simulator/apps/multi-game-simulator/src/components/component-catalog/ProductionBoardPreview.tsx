import { useState } from "react";
import { buildMountedHref } from "../../routes/router-paths";
import classes from "./ProductionBoardPreview.module.css";

/** The existing fixture route mounts the production board with its real providers and skin. */
export default function ProductionBoardPreview({ href, game }: { href: string; game: string }) {
  const [loaded, setLoaded] = useState(false);
  const [portrait, setPortrait] = useState(false);
  return (
    <section aria-label={`${game} production board fixture`} className={classes.preview}>
      <p>Same board, providers, and styles as the game’s existing visual fixture route.</p>
      <div className={classes.controls}>
        <button type="button" onClick={() => setLoaded(!loaded)}>
          {loaded ? "Unload" : "Load"} production board
        </button>
        <label>
          <input
            type="checkbox"
            checked={portrait}
            onChange={(event) => setPortrait(event.target.checked)}
          />{" "}
          Phone viewport
        </label>
        <a href={buildMountedHref(href)} target="_blank" rel="noreferrer">
          Open fixture route ↗
        </a>
      </div>
      {loaded && (
        <iframe
          className={classes.frame}
          data-portrait={portrait || undefined}
          title={`${game} production board`}
          src={buildMountedHref(href)}
        />
      )}
    </section>
  );
}
