import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb02ThePeak008 } from "@tcg/op-cards";
import { prb02ShanksP083PirateFoil083 } from "../../../../../cards/src/cards/characters/p-083-shanks-p-083-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-083 Shanks - P-083 (Pirate Foil)", () => {
  test("paying the Character cost still draws after choosing zero power-reduction targets", () => {
    const e = OnePieceTestEngine.create(
      {
        character: [{ cardId: "P-083", attachedDon: 1 }],
        hand: ["EB01-005"],
        deck: ["EB01-025", "ST01-002"],
      },
      { character: ["EB01-005"] },
    );
    e.asSouth().attack("P-083", e.leader("north"));
    e.asSouth().acceptOptional();
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(e.getView("south").players.south.hand.map((c) => c.cardId)).toEqual(["EB01-025"]);
    expect(e.getView("south").players.south.trash.map((c) => c.cardId)).toEqual(["EB01-005"]);
    expect(e.getView("south").players.south.deckCount).toBe(1);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(3000);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test("with one DON!! may trash only a Character card to reduce an opposing Character and draw", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025, eb02ThePeak008],
        character: [{ card: prb02ShanksP083PirateFoil083, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shanksId = engine.findCardInZone("south", "character", prb02ShanksP083PirateFoil083);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const eventId = engine.findCardInZone("south", "hand", eb02ThePeak008);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.attachDon(shanksId, 1, "south");
    engine.declareAttack(shanksId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Shanks's Character-card cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(paymentId);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(eventId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Shanks's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01Doma005.power ?? 0) - 1000,
    );
    expect(view.prompts).toHaveLength(0);
    engine.asSouth().endTurn();
    expect(
      engine.getView("south").players.north.characters.find((c) => c?.instanceId === targetId)
        ?.power,
    ).toBe(eb01Doma005.power);
  });

  test("may decline the attack effect without paying, reducing, or drawing", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005],
        character: [{ card: prb02ShanksP083PirateFoil083, attachedDon: 1, playedOnTurn: 0 }],
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shanksId = engine.findCardInZone("south", "character", prb02ShanksP083PirateFoil083);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.declareAttack(shanksId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without attached DON!! does not offer the attack effect", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: prb02ShanksP083PirateFoil083, playedOnTurn: 0 }],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01Doma005],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const shanksId = engine.findCardInZone("south", "character", prb02ShanksP083PirateFoil083);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(shanksId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.players.south.hand.map((c) => c.cardId)).toEqual([eb01Doma005.id]);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
