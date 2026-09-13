import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op10EustassCaptainKid099, op10Urouge101 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe('OP10-099 Eustass"Captain"Kid', () => {
  test("turns Life face-up, reactivates a qualifying Supernovas Character, and grants Blocker", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10EustassCaptainKid099,
        life: [eb01Doma005],
        character: [{ card: op10Urouge101, rested: true, playedOnTurn: 0 }],
      },
      { life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const urougeId = engine.findCardInZone("south", "character", op10Urouge101);

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [urougeId] }, "south");

    const southView = engine.getView("south");
    expect(southView.players.south.life[0]).toMatchObject({
      cardId: eb01Doma005.id,
      hidden: false,
    });
    expect(
      southView.players.south.characters.find((card) => card?.instanceId === urougeId)?.rested,
    ).toBe(false);

    engine.declareAttack(engine.leader("north"), engine.leader("south"), "north");
    const blockerStep = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blockerStep?.kind).toBe("selectEntity");
    if (blockerStep?.kind !== "selectEntity") throw new Error("Expected a Blocker choice.");
    expect(blockerStep.candidates.map((candidate) => candidate.ref.id)).toContain(urougeId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op10EustassCaptainKid099,
        life: [eb01Doma005],
        character: [{ card: op10Urouge101, rested: true, playedOnTurn: 0 }],
      },
      { life: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.endTurn("south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
