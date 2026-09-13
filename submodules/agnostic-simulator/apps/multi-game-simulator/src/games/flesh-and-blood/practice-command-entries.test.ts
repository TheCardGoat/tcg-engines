// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import type { FabMoveLog } from "@tcg/flesh-and-blood-engine/simulator";

import {
  practiceCommandEntries,
  type FabPracticeTelemetryEntry,
} from "./FabPracticeSidebarActivity";

const HUMAN = "fab-p1";
const BOT = "fab-p2";
const TIMESTAMP = 1_700_000_000_000;

function semanticLog(playerId: string): FabMoveLog {
  return {
    commandId: `test-command-${playerId}`,
    moveType: "answer-decision",
    playerId,
    timestamp: TIMESTAMP,
    sequence: 0,
    turnNumber: 1,
    public: [
      {
        key: "flesh-and-blood.play",
        values: { actorId: playerId, cardName: "Snatch" },
        defaultMessage: "played",
      },
    ],
  };
}

function entry(
  id: number,
  actorId: string,
  commandLabel: string,
  moveLogs: readonly FabMoveLog[] = [],
  turnNumber = 1,
  move: FabPracticeTelemetryEntry["move"] = "pass",
): FabPracticeTelemetryEntry {
  return {
    id,
    source: actorId === HUMAN ? "player" : "bot",
    actorId,
    controllerId: HUMAN,
    interactionActorId: actorId,
    commandLabel,
    move,
    result: "accepted",
    recordedAt: TIMESTAMP + id * 1_000,
    turnNumber,
    stateId: id,
    moveLogs,
    decisionBefore: null,
    pendingDecision: null,
    completedDecision: null,
    getRawState: () => "{}",
    getRawInteraction: () => "{}",
  };
}

describe("practiceCommandEntries transient pass markers", () => {
  it("renders the trailing pass exchange and drops it once a new action lands", () => {
    const play = [entry(1, HUMAN, "Play Snatch", [semanticLog(HUMAN)])];
    const exchange = [entry(2, HUMAN, "Pass"), entry(3, BOT, "Pass")];

    // While the exchange is the latest thing that happened, both passes stay
    // visible — they mark whose court the ball is in.
    const during = practiceCommandEntries([...play, ...exchange], HUMAN, "public");
    expect(during.map((row) => row.id)).toEqual([
      "fab-practice-command-2",
      "fab-practice-command-3",
    ]);
    expect(during[0]?.message).toBe("Pass");
    expect(during[0]?.seatId).toBe("player");
    expect(during[1]?.seatId).toBe("opponent");

    // The next semantic action supersedes the whole exchange: the passes are
    // implied by the action that followed and vanish from the log.
    const after = practiceCommandEntries(
      [...play, ...exchange, entry(4, HUMAN, "Play Rabble", [semanticLog(HUMAN)])],
      HUMAN,
      "public",
    );
    expect(after).toHaveLength(0);
  });

  it("re-surfaces earlier passes once the superseding action is gone", () => {
    // An undo removed the play: the prior passes trail the log again.
    const telemetry = [entry(1, HUMAN, "Pass"), entry(2, HUMAN, "Pass")];

    const entries = practiceCommandEntries(telemetry, HUMAN, "public");

    expect(entries.map((row) => row.message)).toEqual(["Pass", "Pass"]);
  });

  it("computes the boundary per scope so Yours shows the controlled seat's trailing passes", () => {
    const telemetry = [
      entry(1, HUMAN, "Play Snatch", [semanticLog(HUMAN)]),
      entry(2, HUMAN, "Pass"),
      // Bot acts after the human pass: public history moves on, but the bot's
      // logs are invisible in Yours, so both of the human's passes trail the
      // own-seat corpus and stay visible there.
      entry(3, BOT, "End turn", [semanticLog(BOT)]),
      entry(4, HUMAN, "Pass", [], 2),
    ];

    const publicEntries = practiceCommandEntries(telemetry, HUMAN, "public");
    const playerEntries = practiceCommandEntries(telemetry, HUMAN, "player");

    expect(publicEntries.map((row) => row.id)).toEqual(["fab-practice-command-4"]);
    expect(playerEntries.map((row) => row.id)).toEqual([
      "fab-practice-command-2",
      "fab-practice-command-4",
    ]);
  });

  it("keeps a marker for a pass whose batch only carries the suppressed turn announcement", () => {
    // Live-game shape: closing a priority window can advance the turn, so the
    // pass batch carries a turn.started message the projection suppresses.
    // Raw message counts would call that batch semantic and drop the marker,
    // rendering nothing at all — silence must be measured post-projection.
    const turnAnnouncementLog: FabMoveLog = {
      commandId: "turn-announcement",
      moveType: "answer-decision",
      playerId: HUMAN,
      timestamp: TIMESTAMP,
      sequence: 0,
      turnNumber: 2,
      public: [
        {
          key: "flesh-and-blood.turn.started",
          values: { turnNumber: 2 },
          defaultMessage: "began",
        },
      ],
    };
    const telemetry = [entry(1, HUMAN, "Pass", [turnAnnouncementLog], 2)];

    const entries = practiceCommandEntries(telemetry, HUMAN, "public");

    expect(entries.map((row) => row.message)).toEqual(["Pass"]);
  });

  it("treats viewer-private appendix content as semantic for the Yours boundary", () => {
    const privateLog: FabMoveLog = {
      commandId: "private-draw",
      moveType: "answer-decision",
      playerId: HUMAN,
      timestamp: TIMESTAMP,
      sequence: 0,
      turnNumber: 1,
      public: [],
      privateByPlayerId: {
        [HUMAN]: [
          {
            key: "flesh-and-blood.draw.private",
            values: { playerId: HUMAN },
            defaultMessage: "drew",
          },
        ],
      },
    };
    const telemetry = [entry(1, HUMAN, "Pass"), entry(2, HUMAN, "Draw", [privateLog])];

    // The private draw produces rows in the Yours projection, so the earlier
    // pass is superseded there. In Public the draw's content is invisible, so
    // the Draw command keeps its label row as the only public witness that a
    // draw happened — and the pass still trails it in that scope.
    const playerEntries = practiceCommandEntries(telemetry, HUMAN, "player");
    const publicEntries = practiceCommandEntries(telemetry, HUMAN, "public");

    expect(playerEntries).toHaveLength(0);
    expect(publicEntries.map((row) => row.message)).toEqual(["Pass", "Draw"]);
  });

  it("never exposes a private automation command through its contextual label", () => {
    const privateAutomationLog: FabMoveLog = {
      commandId: "private-automation",
      moveType: "set-automation-preferences",
      playerId: HUMAN,
      timestamp: TIMESTAMP,
      sequence: 0,
      turnNumber: 1,
      public: [],
      privateByPlayerId: {
        [HUMAN]: [
          {
            key: "flesh-and-blood.command.instant-auto-yield-enabled",
            values: { actorId: HUMAN, cardName: "Cosmic Duality" },
            defaultMessage: `${HUMAN} enabled auto-yield for Cosmic Duality.`,
          },
        ],
      },
    };
    const telemetry = [
      entry(
        1,
        HUMAN,
        "Auto-yield this card",
        [privateAutomationLog],
        1,
        "set-automation-preferences",
      ),
    ];

    expect(practiceCommandEntries(telemetry, HUMAN, "public")).toEqual([]);
    expect(practiceCommandEntries(telemetry, HUMAN, "player")).toEqual([]);
  });
});
