import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op03Carne045 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-045 Carne", () => {
  test("gains 3000 power with 20 deck cards on the opponent's turn and can Block", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op03Carne045],
        deck: Array.from({ length: 20 }, () => eb01Doma005),
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const carneId = engine.findCardInZone("south", "character", op03Carne045);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === carneId)
        ?.power,
    ).toBe((op03Carne045.power ?? 0) + 3000);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Carne's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(carneId);
    engine.resolveDecision("battleBlocker", { selectedIds: [carneId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      carneId,
    );
  });

  test("does not gain power on its controller's turn or above the 20-card threshold", () => {
    const turnGate = OnePieceTestEngine.create(
      {
        character: [op03Carne045],
        deck: Array.from({ length: 20 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const turnGateId = turnGate.findCardInZone("south", "character", op03Carne045);

    expect(
      turnGate
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === turnGateId)?.power,
    ).toBe(op03Carne045.power);

    turnGate.endTurn("south");

    expect(
      turnGate
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === turnGateId)?.power,
    ).toBe((op03Carne045.power ?? 0) + 3000);

    const deckGate = OnePieceTestEngine.create(
      {
        character: [op03Carne045],
        deck: Array.from({ length: 21 }, () => eb01Doma005),
      },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const deckGateId = deckGate.findCardInZone("south", "character", op03Carne045);
    expect(
      deckGate
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === deckGateId)?.power,
    ).toBe(op03Carne045.power);
  });
});
