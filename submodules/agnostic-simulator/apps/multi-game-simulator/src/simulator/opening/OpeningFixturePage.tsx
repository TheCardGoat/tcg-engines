import { OpeningPresentation, type OpeningFixture } from "@tcg/simulator-presentation/opening";
import { buildMountedHref } from "../../routes/router-paths";

/** App-only navigation around the portable presentation. */
export function OpeningFixturePage({ fixture }: { fixture: OpeningFixture }) {
  const otherGame = fixture.slug === "alpha-clash" ? "grand-archive" : "alpha-clash";
  return (
    <OpeningPresentation
      fixture={fixture}
      homeHref={buildMountedHref("/simulator-ui-fixtures")}
      switchHref={buildMountedHref(`/${otherGame}/simulator/tests/opening-preview`)}
      notes={
        fixture.slug === "alpha-clash" ? (
          <p>
            Engine integration limit: Alpha Clash currently supports only a full-hand redraw. This
            fixture demonstrates CR 103.5 selective mulligans.
          </p>
        ) : undefined
      }
    />
  );
}
