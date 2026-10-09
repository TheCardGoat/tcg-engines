import { lazy, Suspense } from "react";
import { boardChoiceCases, isBoardChoiceCase } from "../games/alpha-clash/choice-board-fixtures";
const ChoiceBoard = lazy(() => import("../games/alpha-clash/AlphaClashChoiceBoardFixture"));
import { Navigate, useParams, useSearchParams } from "react-router";
import { buildMountedHref } from "../routes/router-paths";

const AlphaClash = lazy(async () => {
  const [
    { AlphaClashSimulatorProviders },
    { AlphaClashPracticePage },
    { AlphaClashInteractionPreview },
  ] = await Promise.all([
    import("../games/alpha-clash/App"),
    import("../games/alpha-clash/pages/Practice.page"),
    import("../games/alpha-clash/AlphaClashInteractionPreview"),
  ]);
  return {
    default: ({ kind }: { kind: string }) => (
      <AlphaClashSimulatorProviders>
        {isBoardChoiceCase(kind.replace("board-", "")) && kind.startsWith("board-") ? (
          <BoardChoice kind={kind.slice(6)} />
        ) : kind === "practice" ? (
          <AlphaClashPracticePage />
        ) : (
          <AlphaClashInteractionPreview key={kind} scenario={kind} />
        )}
      </AlphaClashSimulatorProviders>
    ),
  };
});
function BoardChoice({ kind }: { kind: string }) {
  return isBoardChoiceCase(kind) ? <ChoiceBoard key={kind} kind={kind} /> : null;
}
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
  const [search, setSearch] = useSearchParams();
  const alphaClashKind = search.get("scenario") ?? "practice";
  const grandArchiveKind = search.get("scenario") ?? "inventory";
  if (gameSlug === "alpha-clash" && alphaClashKind === "resource-step")
    return <Navigate replace to="/alpha-clash/simulator/tests/resource-step" />;
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
        <a
          href={`${buildMountedHref("/simulator-ui-fixtures/game-interactions/alpha-clash")}?mode=self`}
        >
          Alpha Clash: play both sides
        </a>
      </nav>
      {gameSlug === "alpha-clash" && (
        <label
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            padding: 16,
            background: "#101923",
            color: "#e7edf6",
          }}
        >
          Interaction scenario
          <select
            aria-label="Alpha Clash interaction scenario"
            value={alphaClashKind}
            style={{ maxWidth: "100%", minHeight: 44, padding: "0 12px", borderRadius: 8 }}
            onChange={(event) => setSearch({ scenario: event.currentTarget.value, mode: "self" })}
          >
            <option value="resource-step">Player action · Deploy or skip resource</option>
            {boardChoiceCases.map(([id, label]) => (
              <option key={id} value={`board-${id}`}>
                {label}
              </option>
            ))}
            <option value="practice">Native practice: play both sides</option>
            <option value="option">Optional effect: yes or no</option>
            <option value="modal">Choose an effect</option>
            <option value="target">Choose a target</option>
            <option value="count">Declare a number</option>
            <option value="division">Divide damage</option>
          </select>
        </label>
      )}
      <Suspense fallback={<p role="status">Loading the local engine…</p>}>
        {gameSlug === "alpha-clash" ? (
          <AlphaClash kind={alphaClashKind} />
        ) : gameSlug === "grand-archive" ? (
          <GrandArchive kind={grandArchiveKind} />
        ) : (
          <p>Choose a game above.</p>
        )}
      </Suspense>
    </>
  );
}
