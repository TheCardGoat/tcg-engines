import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04IsshoOp14021021 } from "../../../../../cards/src/cards/OP14EB04/characters/021-issho-op14-021.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-021 Issho", () => {
  test("only its own rest offers top-Life payment and freezes one rested opponent for the next Refresh", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: op14eb04IsshoOp14021021, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
        life: [eb01Fourtricks025, eb01Doma005],
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const isshoId = engine.findCardInZone("south", "character", op14eb04IsshoOp14021021);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const topLifeId = engine.findCardInZone("south", "life", eb01Fourtricks025);

    engine.declareAttack(allyId, engine.leader("north"), "south");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();

    engine.declareAttack(isshoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const freeze = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (freeze?.kind !== "selectEntity") throw new Error("Expected Issho's freeze target.");
    expect(freeze).toMatchObject({ min: 0, max: 1 });
    expect(freeze.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(topLifeId);
    engine.endTurn("south");
    view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
  });

  test("may decline without taking Life or freezing an opposing card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op14eb04IsshoOp14021021, playedOnTurn: 0 }],
        life: [eb01Fourtricks025],
      },
      { character: [{ card: eb01Doma005, rested: true, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const isshoId = engine.findCardInZone("south", "character", op14eb04IsshoOp14021021);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(isshoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(1);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
