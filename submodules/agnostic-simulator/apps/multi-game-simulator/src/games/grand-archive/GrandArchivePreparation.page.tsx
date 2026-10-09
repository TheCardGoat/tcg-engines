import type { MatchSession } from "@tcg/game-page-contract";
import { Button, Group } from "@mantine/core";
import {
  parseGrandArchivePreparationPool,
  parseGrandArchivePreparationSelection,
} from "@tcg/grand-archive-server-adapter/preparation";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useMatchSession } from "../../simulator/MatchSessionProvider";
import { MatchSessionRecovery } from "../../simulator/MatchSessionRecovery";
import { GrandArchivePreparation } from "./GrandArchivePreparation";
import { useState } from "react";

export function GrandArchivePreparationPage({
  session,
}: {
  session: Extract<MatchSession, { phase: "preparation" }>;
}) {
  const { submitPreparation } = useMatchSession();
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
  const submit = async (
    _suffix: string,
    body: { gameId?: string; firstPlayerId: string } | { gameId?: string; selection: unknown },
  ) => {
    const result = await submitPreparation(
      "firstPlayerId" in body
        ? { type: "choose_preparation_first_player", firstPlayerId: body.firstPlayerId }
        : { type: "confirm_preparation", selection: body.selection },
    );
    if (result.status === "rejected") throw new Error(result.message);
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
