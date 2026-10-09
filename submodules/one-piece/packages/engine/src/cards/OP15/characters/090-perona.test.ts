import { describe, expect, test } from "vite-plus/test";
import { eb01ConquererOfThreeWorldsRagnaraku039, eb01Doma005, op02IceAge117 } from "@tcg/op-cards";
import { op15Perona090 } from "../../../../../cards/src/cards/characters/op15-090-perona.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-090 Perona", () => {
  test("saves a threatened Character by trashing a hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Perona090, eb01Doma005],
        hand: [op02IceAge117],
        activeDon: 2,
      },
      { hand: [eb01ConquererOfThreeWorldsRagnaraku039], activeDon: 5, restedDon: 1 },
    );
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const iceAgeId = engine.findCardInZone("south", "hand", op02IceAge117);

    engine.endTurn("south");
    engine.playCard(eb01ConquererOfThreeWorldsRagnaraku039, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");
    engine.acceptLeadingOptional("north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    // The lone hand card is trashed automatically.
    const south = engine.getView("south").players.south;
    expect(south.characters.some((card) => card?.instanceId === domaId)).toBe(true);
    expect(south.trash.map((card) => card.instanceId)).toContain(iceAgeId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Continuous] survives the turn handoff", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-090", attachedDon: 1 }], activeDon: 5 },
      { activeDon: 5 },
    );
    const northBefore = engine.getView("south").players.north;

    engine.endTurn("south");
    const after = engine.getView("south").players.north;

    expect(after.activeDon).toBe(northBefore.activeDon + 2);
    expect(after.lifeCount).toBe(northBefore.lifeCount);
    expect(engine.getView("south").players.south.characters.map((c) => c?.cardId)).toContain(
      "OP15-090",
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("opponent's Red Roc Trigger cannot bottom a low-base-power Character after paid replacement even at 8000 current power", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: "OP05-001",
        character: ["OP15-090", "EB01-005"],
        hand: ["OP02-117"],
        activeDon: 5,
      },
      { leaderCardId: "OP01-060", life: ["OP04-056", "OP03-057"] },
    );
    const target = e.findCardInZone("south", "character", "EB01-005");
    const payment = e.findCardInZone("south", "hand", "OP02-117");
    e.asSouth().attachDon(target, 5);
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(8000);
    const deck = e.getView("south").players.south.deckCount;
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    e.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    const view = e.getView("south");
    expect(view.players.south.characters.some((c) => c?.instanceId === target)).toBe(true);
    expect(view.players.south.trash.map((c) => c.instanceId)).toContain(payment);
    expect(view.players.south.handCount).toBe(0);
    expect(view.players.south.deckCount).toBe(deck);
    expect(view.prompts).toHaveLength(0);
  });

  test("8000 base power remains ineligible after Otama reduces current power to 6000", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST06-001", character: ["OP15-090", "OP16-096"], hand: ["OP02-117"] },
      { leaderCardId: "OP04-001", hand: ["OP01-006", "OP04-056"], activeDon: 7 },
      { activeSeat: "north" },
    );
    const target = e.findCardInZone("south", "character", "OP16-096");
    const payment = e.findCardInZone("south", "hand", "OP02-117");
    e.asNorth().play("OP01-006");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === target)?.power,
    ).toBe(6000);
    const deck = e.getView("south").players.south.deckCount;
    e.asNorth().play("OP04-056");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "north");
    const view = e.getView("south");
    expect(view.players.south.characters.some((c) => c?.instanceId === target)).toBe(false);
    expect(view.players.south.hand.map((c) => c.instanceId)).toEqual([payment]);
    expect(view.players.south.deckCount).toBe(deck + 1);
    expect(view.players.south.trash).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
