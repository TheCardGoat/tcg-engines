import { alphaClashNativeFixturePath } from "../games/alpha-clash/prompt-fixture-catalog";
import { lazy, Suspense } from "react";
import { Navigate, useParams, useSearchParams } from "react-router";
import { buildMountedHref } from "../routes/router-paths";

const GrandArchive = lazy(async () => {
  const [{ GrandArchiveSimulatorProviders }, { GrandArchiveInteractionInventory }] =
    await Promise.all([
      import("../games/grand-archive/App"),
      import("../games/grand-archive/GrandArchiveInteractionInventory"),
    ]);
  return {
    default: ({ kind }: { kind: string }) => (
      <GrandArchiveSimulatorProviders>
        <GrandArchiveInteractionInventory scenario={kind} />
      </GrandArchiveSimulatorProviders>
    ),
  };
});

/** Native adapter-backed checks, reachable without a hosted match or gateway. */
export default function GameInteractionFixturesPage() {
  const { gameSlug } = useParams();
  const [search] = useSearchParams();
  const alphaClashKind = search.get("scenario") ?? "practice";
  const grandArchiveKind = search.get("scenario") ?? "inventory";
  const nativeFixturePath = alphaClashNativeFixturePath(alphaClashKind);
  if (gameSlug === "alpha-clash")
    return (
      <Navigate
        replace
        to={
          nativeFixturePath ??
          (alphaClashKind === "practice"
            ? "/alpha-clash/simulator/practice"
            : "/alpha-clash/simulator/tests")
        }
      />
    );
  return (
    <>
      <nav
        style={{
          padding: 16,
          background: "#0a111d",
          color: "#e7edf6",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <a href={buildMountedHref("/simulator-ui-fixtures/interactions")}>Interaction inventory</a>
        <a href={buildMountedHref("/simulator-ui-fixtures/game-interactions/grand-archive")}>
          Grand Archive: interaction inventory
        </a>
        <a
          href={`${buildMountedHref("/simulator-ui-fixtures/game-interactions/grand-archive")}?scenario=materialization-hand`}
        >
          Grand Archive: materialization
        </a>
        <a href={buildMountedHref("/simulator-ui-fixtures/game-interactions/alpha-clash")}>
          Alpha Clash: bot practice
        </a>
      </nav>
      <Suspense fallback={<p role="status">Loading the local engine…</p>}>
        {gameSlug === "grand-archive" ? (
          <GrandArchive kind={grandArchiveKind} />
        ) : (
          <p>Choose a game above.</p>
        )}
      </Suspense>
    </>
  );
}
