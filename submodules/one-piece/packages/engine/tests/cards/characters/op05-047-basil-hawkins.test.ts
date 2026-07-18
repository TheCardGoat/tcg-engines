import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05BasilHawkins047 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-047 Basil Hawkins", () => {
  test("blocks, draws at three hand cards, and gains 1000 power for that battle", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op05BasilHawkins047],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op05BasilHawkins047);
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity")
      throw new Error("Expected Basil Hawkins's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(blockerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const duringBattle = engine.getView("south");
    expect(duringBattle.players.south.handCount).toBe(4);
    expect(
      duringBattle.players.south.characters.find((card) => card?.instanceId === blockerId),
    ).toMatchObject({ rested: true, power: 6000 });

    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blockerId),
    ).toMatchObject({ power: 5000 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw above three hand cards but still gains battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op05BasilHawkins047],
        hand: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
      },
      { character: [{ card: eb01Fourtricks025, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const blockerId = engine.findCardInZone("south", "character", op05BasilHawkins047);
    const attackerId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [blockerId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 4, deckCount: 2 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === blockerId)?.power,
    ).toBe(6000);

    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
