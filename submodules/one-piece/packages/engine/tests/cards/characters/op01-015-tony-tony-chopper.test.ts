import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Jinbe014, op01TonyTonyChopper015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-015 Tony Tony.Chopper", () => {
  test("with DON!! attached, trashes a hand card to return an included Straw Hat Crew Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01TonyTonyChopper015, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        trash: [op01Jinbe014, op01TonyTonyChopper015],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op01TonyTonyChopper015);
    const discardedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const jinbeId = engine.findCardInZone("south", "trash", op01Jinbe014);

    engine.declareAttack(chopperId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Chopper's trash target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([jinbeId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [jinbeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(jinbeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01TonyTonyChopper015, attachedDon: 1, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        trash: [op01Jinbe014, op01TonyTonyChopper015],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const chopperId = engine.findCardInZone("south", "character", op01TonyTonyChopper015);
    engine.declareAttack(chopperId, engine.leader("north"), "south");
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
