import { describe, expect, it } from "vitest";
import type { FabMoveLog, FabMoveLogMessage } from "@tcg/flesh-and-blood-engine/simulator";

import { createOpeningFixtureState } from "./fixtures";
import { projectFabPostGameSessionAnalytics } from "./FabPostGameAnalytics";
import type { FabPresentationState } from "./state";

function message(
  key: string,
  values: Readonly<Record<string, string | number>>,
): FabMoveLogMessage {
  return { key, values, defaultMessage: key };
}

function log(
  playerId: string,
  turnNumber: number,
  sequence: number,
  publicMessages: readonly FabMoveLogMessage[],
): FabMoveLog {
  return {
    commandId: `test-command-${turnNumber}-${sequence}`,
    moveType: "pass",
    playerId,
    timestamp: 1_000 + sequence,
    sequence,
    turnNumber,
    public: publicMessages,
  };
}

function terminalPresentation(): FabPresentationState {
  const state = createOpeningFixtureState();
  return {
    ...state,
    life: { ...state.life, "player-1": 17, "player-2": 0 },
    turnNumber: 2,
    terminal: true,
    result: {
      kind: "win",
      winnerId: "player-1",
      loserId: "player-2",
      reason: "lethal damage",
    },
  };
}

describe("FAB post-game session analytics", () => {
  it("projects authoritative turn, comparison, card, and duration data from semantic receipts", () => {
    const presentation = terminalPresentation();
    const analytics = projectFabPostGameSessionAnalytics({
      presentation,
      viewerId: "player-1",
      telemetry: [
        {
          id: 1,
          recordedAt: 1_000,
          moveLogs: [
            log("player-1", 1, 0, [
              message("flesh-and-blood.play", {
                actorId: "player-1",
                cardName: "Snatch",
              }),
              message("flesh-and-blood.pitch", {
                playerId: "player-1",
                cardName: "Nimblism",
                resources: 3,
              }),
              message("flesh-and-blood.attack", {
                actorId: "player-1",
                cardName: "Snatch",
                targetName: "player-2",
              }),
            ]),
            log("player-2", 1, 1, [
              message("flesh-and-blood.defend", {
                actorId: "player-2",
                cardName: "Sink Below",
              }),
              message("flesh-and-blood.combat.hit", {
                cardName: "Snatch",
                targetName: "player-2",
                damage: 6,
              }),
            ]),
          ],
        },
        {
          id: 2,
          recordedAt: 5_000,
          moveLogs: [
            log("player-2", 2, 0, [
              message("flesh-and-blood.pitch", {
                playerId: "player-2",
                cardName: "Disable",
                resources: 2,
              }),
              message("flesh-and-blood.attack", {
                actorId: "player-2",
                cardName: "Disable",
                targetName: "player-1",
              }),
              message("flesh-and-blood.combat.hit", {
                cardName: "Disable",
                targetName: "player-1",
                damage: 3,
              }),
            ]),
          ],
        },
      ],
    });

    expect(analytics).not.toBeNull();
    expect(analytics?.durationSeconds).toBe(4);
    expect(analytics?.comparison).toEqual([
      expect.objectContaining({
        id: "attack-damage",
        viewer: "6",
        opponent: "3",
        source: "session",
      }),
      expect.objectContaining({ id: "hits-attacks", viewer: "1 / 1", opponent: "1 / 1" }),
      expect.objectContaining({ id: "cards-defended", viewer: "0", opponent: "1" }),
      expect.objectContaining({ id: "cards-pitched", viewer: "1", opponent: "1" }),
    ]);
    expect(analytics?.turns).toEqual([
      expect.objectContaining({
        turn: 1,
        cardsPlayed: 1,
        cardsPitched: 1,
        resourcesGenerated: 3,
        damageDealt: 6,
        cardsDefended: 0,
        source: "session",
      }),
      expect.objectContaining({ turn: 2, damageDealt: 0, source: "session" }),
    ]);
    expect(analytics?.opponentCards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Sink Below", defended: 1 }),
        expect.objectContaining({ name: "Disable", pitched: 1, hits: 1 }),
      ]),
    );
    expect(analytics?.opponentCards).toHaveLength(2);
    expect(analytics?.cards).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Snatch", played: 1, hits: 1, source: "session" }),
        expect.objectContaining({ name: "Nimblism", pitched: 1, source: "session" }),
      ]),
    );
  });

  it("fails closed when the bounded telemetry window no longer starts at the first receipt", () => {
    expect(
      projectFabPostGameSessionAnalytics({
        presentation: terminalPresentation(),
        viewerId: "player-1",
        telemetry: [{ id: 7, recordedAt: 7_000, moveLogs: [] }],
      }),
    ).toBeNull();
  });
});
