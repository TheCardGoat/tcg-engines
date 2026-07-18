import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op04Diamante028 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-028 Diamante", () => {
  test("is offered as a Blocker and redirects the attack without losing Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Diamante028] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const diamanteId = engine.findCardInZone("south", "character", op04Diamante028);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Diamante's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(diamanteId);
    engine.resolveDecision("battleBlocker", { selectedIds: [diamanteId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === diamanteId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("sets itself active with attached DON!! and two active DON!! cards", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Diamante028, attachedDon: 1, rested: true }],
      activeDon: 2,
    });
    const diamanteId = engine.findCardInZone("south", "character", op04Diamante028);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === diamanteId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not count rested DON!! toward the two-active-DON!! gate", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Diamante028, attachedDon: 1, rested: true }],
      activeDon: 1,
      restedDon: 1,
    });
    const diamanteId = engine.findCardInZone("south", "character", op04Diamante028);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === diamanteId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not set itself active without attached DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op04Diamante028, rested: true }],
      activeDon: 2,
    });
    const diamanteId = engine.findCardInZone("south", "character", op04Diamante028);

    engine.endTurn("south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === diamanteId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
