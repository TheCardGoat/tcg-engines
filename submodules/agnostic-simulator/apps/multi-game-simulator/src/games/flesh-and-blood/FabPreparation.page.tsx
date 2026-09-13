import { useState } from "react";
import { Paper } from "@mantine/core";
import { MatchSessionRecovery } from "../../simulator/MatchSessionRecovery";
import type { MatchSession } from "@tcg/game-page-contract";
import { PregameTurnOrderSchema, type PregameTurnOrder } from "@tcg/game-page-contract/schemas";
import type {
  FabPregameCardPool,
  FabPregameSelection,
} from "@tcg/flesh-and-blood-engine/simulator";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useMatchSession } from "../../simulator/MatchSessionProvider";
import { playUrl } from "../../runtime/gameRuntimeApi";
import { FabPregameSideboard, type FabPregameParticipant } from "./FabPregameSideboard";
import { FabFirstPlayerChoice } from "./FabFirstPlayerChoice";

interface LivePregameProjection {
  readonly playerId: string;
  readonly turnOrder: PregameTurnOrder;
  readonly gameId: string;
  readonly status: "waiting" | "in_progress" | "completed" | "abandoned";
  readonly deadlineAt: string;
  readonly pool: FabPregameCardPool;
  readonly selection: FabPregameSelection;
  readonly player: FabPregameParticipant;
  readonly opponent: FabPregameParticipant & { playerId: string };
  readonly locked: boolean;
  readonly opponentReady: boolean;
  readonly cancelledReason?: string;
}

function parsePregameProjection(raw: unknown): LivePregameProjection | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<LivePregameProjection>;
  return PregameTurnOrderSchema.safeParse(value.turnOrder).success &&
    typeof value.playerId === "string" &&
    value.pool &&
    value.selection &&
    value.player &&
    value.opponent &&
    typeof value.deadlineAt === "string"
    ? (value as LivePregameProjection)
    : null;
}

export function FabPreparationPage({
  session,
}: {
  session: Extract<MatchSession, { phase: "preparation" }>;
}) {
  const { refresh, error: recoveryError } = useMatchSession();
  const [error, setError] = useState<string | null>(null);
  const pregame = parsePregameProjection(session.preparation);
  if (!pregame)
    return (
      <SimulatorRouteStatus
        title="Preparation unavailable"
        message="The server returned an invalid preparation view."
      />
    );
  const submit = async (suffix: string, body: object) => {
    setError(null);
    try {
      const response = await fetch(
        playUrl(
          "flesh-and-blood",
          `/matches/${encodeURIComponent(session.match.matchId)}/pregame${suffix}`,
        ),
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok)
        throw new Error("Could not save preparation. Synchronize the match and try again.");
      // Command replies are not a second source of lifecycle truth.
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save preparation.");
      throw cause;
    }
  };
  return (
    <div className="flex h-dvh min-h-0 flex-col [&_.fab-sideboard]:h-auto [&_.fab-sideboard]:flex-1">
      {error ? <div role="alert">{error}</div> : null}
      {pregame.turnOrder.stage === "chosen" && recoveryError && (
        <Paper p="sm" className="shrink-0">
          <MatchSessionRecovery />
        </Paper>
      )}
      <FabPregameSideboard
        key={pregame.gameId}
        pool={pregame.pool}
        initialSelection={pregame.selection}
        player={pregame.player}
        opponent={pregame.opponent}
        deadline={Date.parse(pregame.deadlineAt)}
        opponentReady={pregame.opponentReady}
        locked={pregame.locked}
        onConfirm={(selection) => {
          void submit("", { gameId: pregame.gameId, selection }).catch(() => {});
        }}
        onLeave={() => window.location.assign("/flesh-and-blood/simulator")}
        turnOrderLabel={
          pregame.turnOrder.stage === "choosing"
            ? "Choosing turn order"
            : pregame.turnOrder.firstPlayerId === pregame.playerId
              ? "You go first"
              : "You go second"
        }
        turnOrderBlocking={
          pregame.turnOrder.stage === "choosing" && pregame.turnOrder.chooserId === pregame.playerId
        }
        turnOrderDialog={
          pregame.turnOrder.stage === "choosing" ? (
            <FabFirstPlayerChoice
              player={pregame.player}
              opponent={pregame.opponent}
              deadline={Date.parse(pregame.deadlineAt)}
              canChoose={pregame.turnOrder.chooserId === pregame.playerId}
              recovery={<MatchSessionRecovery />}
              onChoose={(goFirst) =>
                submit("/first-player", {
                  gameId: pregame.gameId,
                  firstPlayerId: goFirst ? pregame.playerId : pregame.opponent.playerId,
                })
              }
            />
          ) : undefined
        }
      />
    </div>
  );
}
