import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Button } from "@mantine/core";
import type { FabPracticeMatch } from "@tcg/flesh-and-blood-engine/simulator";
import { ReplayForkPositionV1Schema } from "@tcg/game-page-contract/replay-fork";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { playUrl } from "../../runtime/gameRuntimeApi";
import { parseNonNegativeIntegerQuery } from "../../runtime/replayQuery";
import { LocalEngineMatch } from "./Practice.page";
import { restoreFabReplayFork } from "./replay-fork";

type ForkLoad =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; match: FabPracticeMatch };

export function FabReplayForkPage() {
  const { gameId = "" } = useParams();
  const [search] = useSearchParams();
  const cursor = parseNonNegativeIntegerQuery(search.get("step")) ?? 0;
  const secondPlayer = search.get("side") === "playerTwo";
  const [load, setLoad] = useState<ForkLoad>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    setLoad({ status: "loading" });
    void (async () => {
      const response = await fetch(
        playUrl("flesh-and-blood", `/replays/${encodeURIComponent(gameId)}/fork?step=${cursor}`),
        { credentials: "include", headers: { Accept: "application/json" } },
      );
      if (!response.ok)
        throw new Error(
          "This position has no available continuation. Sign in as a match participant and choose a position before the end.",
        );
      const position = ReplayForkPositionV1Schema.parse(await response.json());
      if (
        position.gameId !== gameId ||
        position.gameType !== "flesh-and-blood" ||
        position.cursor !== cursor
      )
        throw new Error("The server returned a different replay position.");
      const match = await restoreFabReplayFork(position.state);
      if (!cancelled) setLoad({ status: "ready", match });
    })().catch((error: unknown) => {
      if (!cancelled)
        setLoad({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to continue this replay.",
        });
    });
    return () => {
      cancelled = true;
    };
  }, [gameId, cursor]);
  const replayHref = `/flesh-and-blood/simulator/replay/${encodeURIComponent(gameId)}?step=${cursor}`;
  const back = (
    <Button component={Link} to={replayHref} variant="default">
      Back to replay
    </Button>
  );
  if (load.status !== "ready")
    return (
      <SimulatorRouteStatus
        title={load.status === "loading" ? "Opening replay fork" : "Fork unavailable"}
        message={load.status === "loading" ? "Restoring the selected position." : load.message}
        action={back}
      />
    );
  const { match } = load;
  return (
    <LocalEngineMatch
      key={`${gameId}:${cursor}:${secondPlayer}`}
      match={match}
      humanId={secondPlayer ? match.player2Id : match.player1Id}
      botId={secondPlayer ? match.player1Id : match.player2Id}
      botStrategyId={null}
      sessionKey={`fork:${gameId}:${cursor}`}
      statusLabel={`Replay fork · Move ${cursor}`}
      sidebarExtra={back}
    />
  );
}
