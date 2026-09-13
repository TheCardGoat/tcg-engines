import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb02MonkeyDGarp049,
  op02MonkeyDGarp002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-049 Monkey.D.Garp", () => {
  test("gives two rested DON!! to its Leader, then rests to K.O. only a cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02MonkeyDGarp002,
        hand: [eb02MonkeyDGarp049],
        activeDon: 5,
        restedDon: 2,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(eb02MonkeyDGarp049, "south");
    const garpId = engine.findCardInZone("south", "character", eb02MonkeyDGarp049);

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Garp's rested DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    expect(engine.getView("south").players.south.leader.attachedDon).toBe(2);

    engine.activateEffect(garpId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Garp's low-cost K.O. choice.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === garpId)?.rested).toBe(
      true,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02MonkeyDGarp002,
        hand: [eb02MonkeyDGarp049],
        activeDon: 5,
        restedDon: 2,
      },
      { character: [eb01Doma005, eb01Fourtricks025] },
    );

    engine.playCard(eb02MonkeyDGarp049, "south");
    const garpId = engine.findCardInZone("south", "character", eb02MonkeyDGarp049);
    engine.resolveDecision("effectGiveDonCount", { optionId: "2" }, "south");
    engine.activateEffect(garpId, "activateMain", "south");
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
