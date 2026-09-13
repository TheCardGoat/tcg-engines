import type { MatchSession } from "@tcg/game-page-contract";
import { Button, Group } from "@mantine/core";
import {
  parseGrandArchivePreparationPool,
  parseGrandArchivePreparationSelection,
} from "@tcg/grand-archive-server-adapter/preparation";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useMatchSession } from "../../simulator/MatchSessionProvider";
import { MatchSessionRecovery } from "../../simulator/MatchSessionRecovery";
import { playUrl } from "../../runtime/gameRuntimeApi";
import { GrandArchivePreparation } from "./GrandArchivePreparation";
import { useState } from "react";

export function GrandArchivePreparationPage({
  session,
}: {
  session: Extract<MatchSession, { phase: "preparation" }>;
}) {
  const { refresh } = useMatchSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const view = session.preparation;
  let pool, selection;
  try {
    if (view.kind !== "grand-archive") throw new Error("Unexpected preparation kind");
    pool = parseGrandArchivePreparationPool(view.pool);
    selection = parseGrandArchivePreparationSelection(view.selection);
  } catch {
    return (
      <SimulatorRouteStatus
        title="Preparation unavailable"
        message="The server returned an invalid preparation view."
      />
    );
  }
  const submit = async (suffix: string, body: object) => {
    const response = await fetch(
      playUrl(
        "grand-archive",
        `/matches/${encodeURIComponent(session.match.matchId)}/pregame${suffix}`,
      ),
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: view.gameId, ...body }),
      },
    );
    const result: unknown = await response.json().catch(() => null);
    if (
      !response.ok ||
      typeof result !== "object" ||
      result === null ||
      !("object" in result) ||
      result.object !== "game_pregame"
    )
      throw new Error("Could not save preparation. Synchronize and try again.");
    await refresh();
  };
  return (
    <>
      <GrandArchivePreparation
        recovery={<MatchSessionRecovery />}
        externalError={error}
        key={view.gameId}
        pool={pool}
        initialSelection={selection}
        playerLabel={view.player.label}
        opponentLabel={view.opponent.label}
        locked={view.locked}
        opponentReady={view.opponentReady}
        deadline={Date.parse(view.deadlineAt)}
        onLeave={() => window.location.assign("/grand-archive/matchmaking")}
        onConfirm={(chosen) => submit("", { selection: chosen })}
        turnOrderLabel={
          view.turnOrder.stage === "chosen"
            ? view.turnOrder.firstPlayerId === view.playerId
              ? "You go first"
              : "You go second"
            : "Turn order pending"
        }
        turnOrderControl={
          view.turnOrder.stage === "choosing" && view.turnOrder.chooserId === view.playerId ? (
            <Group>
              {[true, false].map((first) => (
                <Button
                  key={String(first)}
                  disabled={busy}
                  variant="light"
                  onClick={async () => {
                    setBusy(true);
                    setError(null);
                    try {
                      await submit("/first-player", {
                        firstPlayerId: first ? view.playerId : view.opponent.playerId,
                      });
                    } catch (cause) {
                      setError(
                        cause instanceof Error ? cause.message : "Could not choose turn order.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Go {first ? "first" : "second"}
                </Button>
              ))}
            </Group>
          ) : undefined
        }
      />
    </>
  );
}
