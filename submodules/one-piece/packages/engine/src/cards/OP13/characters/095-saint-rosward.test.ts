import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Kaido094 } from "@tcg/op-cards";
import { op13StJaygarciaSaturn083 } from "../../../../../cards/src/cards/OP13/characters/083-st-jaygarcia-saturn.ts";
import { op13SaintRosward095 } from "../../../../../cards/src/cards/OP13/characters/095-saint-rosward.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-095 Saint Rosward", () => {
  test("with only included Celestial Dragons may trash a selected hand card to K.O. up to two low-base-cost Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SaintRosward095, eb01Doma005, eb01Fourtricks025],
        character: [op13StJaygarciaSaturn083],
        activeDon: op13SaintRosward095.cost,
      },
      { character: [eb01Doma005, eb01Fourtricks025, op01Kaido094] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", op01Kaido094);

    engine.playCard(op13SaintRosward095, "south");
    const optional = engine.pendingDecision("effectOptional", "south");
    expect(optional.actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    if (cost?.kind !== "payCost") throw new Error("Expected Rosward's hand-trash payment.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Rosward's K.O. targets.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    const candidates = target.candidates.map((candidate) => candidate.ref.id);
    expect(candidates).toEqual(expect.arrayContaining([firstTargetId, secondTargetId]));
    expect(candidates).not.toContain(expensiveId);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [firstTargetId, secondTargetId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstTargetId, secondTargetId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("a non-Celestial Dragons Character prevents the K.O. after the hand cost is paid", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13SaintRosward095, eb01Fourtricks025],
        character: [eb01MountainGod018],
        activeDon: op13SaintRosward095.cost,
      },
      { character: [eb01Doma005] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13SaintRosward095, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing a hand card or K.O.'ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13SaintRosward095, eb01Fourtricks025], activeDon: op13SaintRosward095.cost },
      { character: [eb01Doma005] },
    );
    const paymentId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op13SaintRosward095, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });
});
