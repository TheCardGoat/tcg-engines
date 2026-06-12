import { describe, expect, it } from "bun:test";
import { arielOnHumanLegs, simbaProtectiveCub } from "@tcg/lorcana-cards/cards/001";
import { leviathansLairDangerousGround } from "@tcg/lorcana-cards/cards/012";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";

import { snapshotPendingPrompt } from "./prompt-snapshot.js";

describe("Leviathan's Lair - Dangerous Ground | LOST TO THE DUNES | UI prompt", () => {
  it("renders only opponent characters in play as banish candidates", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [leviathansLairDangerousGround],
      },
      {
        hand: [arielOnHumanLegs],
        play: [{ card: simbaProtectiveCub, isDrying: false }],
      },
    );

    const lairId = testEngine.findCardInstanceId(leviathansLairDangerousGround, "play", PLAYER_ONE);
    const handCharacterId = testEngine.findCardInstanceId(arielOnHumanLegs, "hand", PLAYER_TWO);
    const playCharacterId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", PLAYER_TWO);

    expect(
      testEngine
        .asServer()
        .manualSetDamage(leviathansLairDangerousGround, leviathansLairDangerousGround.willpower),
    ).toBeSuccessfulCommand();

    const snapshot = snapshotPendingPrompt(testEngine, { playerId: PLAYER_TWO });

    expect(snapshot).not.toBeNull();
    expect(snapshot?.kind).toBe("target-selection");
    expect(snapshot?.effectType).toBe("banish");
    expect(snapshot?.chooserId).toBe(PLAYER_TWO);
    expect(snapshot?.sourceCardId).toBe(lairId);
    expect(snapshot?.minSelections).toBe(1);
    expect(snapshot?.maxSelections).toBe(1);
    expect(snapshot?.cardCandidateIds).toEqual([playCharacterId]);
    expect(snapshot?.cardCandidateIds).not.toContain(handCharacterId);
    expect(snapshot?.prompt?.candidateEntries.map((entry) => entry.cardId)).toEqual([
      playCharacterId,
    ]);
  });
});
