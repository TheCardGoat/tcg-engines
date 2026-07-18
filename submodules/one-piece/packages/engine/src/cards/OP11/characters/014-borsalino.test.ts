import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op11Borsalino014, op11Hibari010, op11Koby001 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-014 Borsalino", () => {
  test("rests itself and lets a chosen included Navy Leader or Character attack active Characters", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11Koby001,
        character: [op11Borsalino014, op11Hibari010],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op11Borsalino014);
    const hibariId = engine.findCardInZone("south", "character", op11Hibari010);
    const activeTargetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(borsalinoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Borsalino's Navy choice.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([engine.leader("south"), hibariId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === borsalinoId)?.rested,
    ).toBe(true);
    engine.declareAttack(engine.leader("south"), activeTargetId, "south");
    expect(engine.getView("south").players.south.leader.rested).toBe(true);
  });

  test("may block an opposing attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Borsalino014] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const borsalinoId = engine.findCardInZone("south", "character", op11Borsalino014);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [borsalinoId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
