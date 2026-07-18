import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb03Carina004,
  eb03NefeltariVivi001,
  op10DonquixoteRosinante072,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-004 Carina", () => {
  test("gains power on the opponent's turn and blocks while no base-6000 Character is present", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb03NefeltariVivi001,
        character: [eb03Carina004],
      },
      {
        character: [{ card: eb01Doma005, playedOnTurn: 0 }],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const carinaId = engine.findCardInZone("south", "character", eb03Carina004);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === carinaId)
        ?.power,
    ).toBe(6000);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Carina's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toEqual(["skip", carinaId]);
    engine.resolveDecision("battleBlocker", { selectedIds: [carinaId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === carinaId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("does not gain power when a base-6000 Character is present", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb03NefeltariVivi001,
        character: [eb03Carina004, op10DonquixoteRosinante072],
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const carinaId = engine.findCardInZone("south", "character", eb03Carina004);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === carinaId)
        ?.power,
    ).toBe(2000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
