import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01XDrake054, op02Sakazuki099 } from "@tcg/op-cards";
import { op11Smoker005 } from "../../../../../cards/src/cards/OP11/characters/005-smoker.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-005 Smoker", () => {
  test("blocks an attack against its Leader", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Smoker005] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const smokerId = engine.findCardInZone("south", "character", op11Smoker005);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Smoker's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(smokerId);
    engine.resolveDecision("battleBlocker", { selectedIds: [smokerId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === smokerId)
        ?.rested,
    ).toBe(true);
  });

  test("with one DON!! rejects non-Special Character-effect K.O. but permits Special", () => {
    const protectedEngine = OnePieceTestEngine.create(
      { character: [{ card: op11Smoker005, rested: true, attachedDon: 1 }] },
      { hand: [op01XDrake054], activeDon: op01XDrake054.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const protectedId = protectedEngine.findCardInZone("south", "character", op11Smoker005);
    protectedEngine.playCard(op01XDrake054, "north");
    const protectedTarget = protectedEngine.pendingDecision("effectTargetSelection", "north")
      .steps[0];
    if (protectedTarget?.kind !== "selectEntity")
      throw new Error("Expected X.Drake's K.O. target.");
    expect(protectedTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      protectedId,
    );
    protectedEngine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    expect(
      protectedEngine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === protectedId),
    ).toBe(true);

    const vulnerableEngine = OnePieceTestEngine.create(
      { character: [{ card: op11Smoker005, attachedDon: 1 }] },
      {
        hand: [op02Sakazuki099, eb01Doma005],
        activeDon: op02Sakazuki099.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vulnerableId = vulnerableEngine.findCardInZone("south", "character", op11Smoker005);
    vulnerableEngine.playCard(op02Sakazuki099, "north");
    vulnerableEngine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const target = vulnerableEngine.pendingDecision("effectTargetSelection", "north").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Sakazuki's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(vulnerableId);
    vulnerableEngine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [vulnerableId] },
      "north",
    );

    expect(
      vulnerableEngine.getView("south").players.south.trash.map((card) => card.instanceId),
    ).toContain(vulnerableId);
  });
});
