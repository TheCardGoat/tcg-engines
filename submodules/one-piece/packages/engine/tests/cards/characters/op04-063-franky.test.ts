import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op03Iceburg058,
  op04Franky063,
  op04MissMerrychristmasDrophy067,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-063 Franky", () => {
  test("with an included Water Seven Leader, pays DON!! -1 and prevents battle damage once", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Iceburg058,
        character: [op04Franky063, op04MissMerrychristmasDrophy067],
        activeDon: 2,
      },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const firstAttacker = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const secondAttacker = engine.findCardInZone("north", "character", eb01Doma005);
    const frankyId = engine.findCardInZone("south", "character", op04Franky063);
    const blockerId = engine.findCardInZone("south", "character", op04MissMerrychristmasDrophy067);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(firstAttacker, engine.leader("south"), "north");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(1);

    const decision = engine.pendingDecision("effectTargetSelection", "south");
    expect(decision.actorId).toBe("south");
    const target = decision.steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Franky's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), frankyId, blockerId]),
    );
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(firstAttacker);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe(6000);
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);

    engine.declareAttack(secondAttacker, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose zero after paying without granting battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op03Iceburg058,
        character: [op04Franky063, op04MissMerrychristmasDrophy067],
        activeDon: 2,
      },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.activeDon).toBe(1);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.leader.power).toBe(5000);
    engine.resolveDecision("battleBlocker", { selectedIds: [] }, "south");
    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without paying, while a non-Water Seven Leader may pay but gets no target", () => {
    const declined = OnePieceTestEngine.create(
      { character: [op04Franky063], activeDon: 2 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const declinedAttacker = declined.findCardInZone("north", "character", eb01Doma005);
    declined.declareAttack(declinedAttacker, declined.leader("south"), "north");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");
    let view = declined.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);

    const paid = OnePieceTestEngine.create(
      { character: [op04Franky063], activeDon: 2 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const paidAttacker = paid.findCardInZone("north", "character", eb01Doma005);
    paid.declareAttack(paidAttacker, paid.leader("south"), "north");
    paid.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(paid.getView("south").players.south.activeDon).toBe(1);

    expect(() => paid.pendingDecision("effectTargetSelection", "south")).toThrow();
    view = paid.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect when DON!! -1 cannot be paid", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Franky063] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    const view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });
});
