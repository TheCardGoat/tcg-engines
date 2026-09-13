import type { GameState, PlayerId } from "@tcg-engines/naruto-engine";
import { SimulatorMatchSidebar, type SimulatorMatchParticipant } from "@tcg/simulator-ui";
import type { ReactNode } from "react";

import { SupporterPlayerName } from "../../../components/SupporterPlayerName.tsx";
import { matchReturnUrl } from "../../../routes/match-return-url.ts";
import { useSimulatorPlayers, useSimulatorRoute } from "../../../simulator/providers";
import {
  SimulatorOpponentParticipantActions,
  SimulatorSelfParticipantActions,
} from "../../../simulator/participant-actions";

import { Inspector } from "./Inspector.tsx";
import { LogPanel } from "./LogPanel.tsx";
import classes from "./board.module.css";
import type { BoardKit, EntityZoneKind } from "./types.ts";

export interface NarutoActivityPanelProps {
  readonly kit: BoardKit;
  readonly state: GameState;
  readonly inspected: {
    readonly uid: string | null;
    readonly zone: EntityZoneKind | null;
    readonly owner: PlayerId | null;
  };
  readonly onNewGame?: (() => void) | undefined;
  readonly onReportBug?: (() => void) | undefined;
}

/**
 * Game-owned content for the shared viewport sidebar/drawer. The viewport
 * shell owns its responsive chrome and focus management; this component owns
 * Naruto terminology, inspection, log projection, and legal end-turn action.
 */
export function NarutoActivityPanel({
  kit,
  state,
  inspected,
  onNewGame,
  onReportBug,
}: NarutoActivityPanelProps) {
  const { projection } = kit;
  const route = useSimulatorRoute();
  const players = useSimulatorPlayers();
  const endTurnPill = projection.seamPills.find((pill) => pill.id === "end-turn");
  const inspectedUid = inspected.uid ?? kit.selection?.uid ?? null;
  const inspectedZone = inspected.uid ? inspected.zone : (kit.selection?.kind ?? null);
  const inspectedOwner = inspected.uid ? inspected.owner : kit.selection ? projection.viewer : null;

  const currentParticipant = players.currentPlayer.participant;
  const opponentParticipant = players.opponentPlayer.participant;
  const matchIdentity =
    route.matchId && route.gameId
      ? { matchId: route.matchId, gameId: route.gameId, gameSlug: "naruto" as const }
      : undefined;
  const opponentActions = opponentParticipant ? (
    <SimulatorOpponentParticipantActions
      participant={
        opponentParticipant.isBot
          ? { kind: "bot", displayName: opponentParticipant.displayName }
          : {
              kind: "human",
              gameProfileId: opponentParticipant.id,
              ...(opponentParticipant.userId ? { userId: opponentParticipant.userId } : {}),
              displayName: opponentParticipant.displayName,
            }
      }
      match={matchIdentity}
    />
  ) : undefined;

  const opponent = toParticipant({
    seat: projection.top,
    role: "opponent",
    participant: opponentParticipant,
    mmr: players.opponentPlayer.mmr,
    actions: opponentActions,
    winner: projection.winner,
  });
  const self = toParticipant({
    seat: projection.bottom,
    role: "self",
    participant: currentParticipant,
    mmr: players.currentPlayer.mmr,
    actions: (
      <SimulatorSelfParticipantActions
        gameConfiguration={{
          title: "Leave this Naruto match?",
          description: "Return to Naruto matchmaking and leave this table open for later.",
          confirmLabel: "Return to matchmaking",
          onSelect: () => window.location.assign(matchReturnUrl("naruto", window.location.search)),
        }}
        support={{
          source: "naruto-live-participant-menu",
          gameSlug: "naruto",
          ...(route.matchId ? { matchId: route.matchId } : {}),
          ...(route.gameId ? { gameId: route.gameId } : {}),
          stateVersion: state.log.length,
          turn: state.turn,
        }}
      />
    ),
    winner: projection.winner,
  });

  return (
    <SimulatorMatchSidebar
      className={classes.matchSidebar}
      data-testid="naruto-rail"
      opponent={opponent}
      self={self}
      activity={{
        log: (
          <div className={classes.sidebarLog}>
            <LogPanel lines={projection.logLines} />
          </div>
        ),
        logLabel: "Log",
        secondary: (
          <div className={classes.sidebarTools}>
            <Inspector
              state={state}
              uid={inspectedUid}
              zone={inspectedZone}
              owner={inspectedOwner}
            />
            {onReportBug ? (
              <button
                type="button"
                className={classes.activitySecondaryButton}
                onClick={onReportBug}
              >
                Report a bug from this turn
              </button>
            ) : null}
          </div>
        ),
        secondaryLabel: "Card & tools",
      }}
      activityLabel="Naruto match activity"
      actions={{
        controls: (
          <div className={classes.matchControls}>
            {onNewGame ? (
              <button
                type="button"
                className={classes.activitySecondaryButton}
                data-testid="naruto-setup-rail"
                onClick={onNewGame}
              >
                Return to setup
              </button>
            ) : null}
            {kit.interactive && endTurnPill ? (
              <button
                type="button"
                className={classes.endTurnButton}
                data-testid="naruto-end-turn-rail"
                disabled={!endTurnPill.enabled}
                title={endTurnPill.reason ?? undefined}
                onClick={() => kit.onPill(endTurnPill)}
              >
                End turn
              </button>
            ) : null}
          </div>
        ),
        danger: null,
      }}
    />
  );
}

function toParticipant({
  seat,
  role,
  participant,
  mmr,
  actions,
  winner,
}: {
  readonly seat: NarutoActivityPanelProps["kit"]["projection"]["top"];
  readonly role: "opponent" | "self";
  readonly participant: ReturnType<typeof useSimulatorPlayers>["currentPlayer"]["participant"];
  readonly mmr: number | null;
  readonly actions?: ReactNode;
  readonly winner: PlayerId | null;
}): SimulatorMatchParticipant {
  const chakraReady = seat.chakra.filter((chakra) => chakra.faceUp).length;
  const displayName = participant?.displayName.trim() || seat.name;
  const status = winner
    ? winner === seat.player
      ? "Winner"
      : "Finished"
    : seat.isDecider
      ? "Priority"
      : seat.isActive
        ? "Turn"
        : "Waiting";

  return {
    id: participant?.id ?? seat.player,
    role,
    name: <SupporterPlayerName name={displayName} tier={participant?.subscriptionTier} />,
    shortLabel: role === "self" ? "YOU" : initialsFor(displayName),
    active: seat.isActive,
    priority: seat.isDecider,
    status,
    meta: (
      <>
        <span>{seat.leader.name}</span>
        {mmr !== null ? <span title="Rating at match start"> · {Math.round(mmr)} MMR</span> : null}
      </>
    ),
    actions,
    metrics: [
      { id: "life", label: "Life", value: seat.leader.life },
      { id: "chakra", label: "Chakra", value: `${chakraReady}/${seat.chakra.length}` },
      { id: "hand", label: "Hand", value: seat.hand.length },
      { id: "deck", label: "Deck", value: seat.deckCount },
    ],
    testId: role === "self" ? "naruto-sidebar-self" : "naruto-sidebar-opponent",
  };
}

function initialsFor(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "OP";
}
