import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op07Caribou023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-023 Caribou", () => {
  test("gains 1000 power when a public payment reaches 6 rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op07Caribou023],
      hand: [eb01Doma005],
      activeDon: 1,
      restedDon: 5,
    });
    const caribouId = engine.findCardInZone("south", "character", op07Caribou023);

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === caribouId)?.power,
    ).toBe(5000);

    engine.playCard(eb01Doma005, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === caribouId)?.power,
    ).toBe(6000);
  });

  test("may rest as Blocker after an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { character: [op07Caribou023] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01Doma005);
    const caribouId = engine.findCardInZone("north", "character", op07Caribou023);

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Caribou's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(caribouId);
    engine.resolveDecision("battleBlocker", { selectedIds: [caribouId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(4);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === caribouId)?.rested,
    ).toBe(true);
  });
});
