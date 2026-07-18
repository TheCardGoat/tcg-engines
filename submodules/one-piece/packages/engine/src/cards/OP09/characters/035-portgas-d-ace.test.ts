import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op09Crocodile046, op09PortgasDAce035 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-035 Portgas.D.Ace", () => {
  test("with two rested Characters, rests only an opposing cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09PortgasDAce035],
        activeDon: op09PortgasDAce035.cost,
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { character: [eb01Doma005, op09Crocodile046] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op09Crocodile046);

    engine.playCard(op09PortgasDAce035, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Ace's rest target.");
    expect(target.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(
      true,
    );
    expect(target.candidates.find((candidate) => candidate.ref.id === expensiveId)?.legal).not.toBe(
      true,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
  });

  test("does not offer the effect with only one rested Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09PortgasDAce035],
        activeDon: op09PortgasDAce035.cost,
        character: [{ card: eb01Doma005, rested: true }, eb01Doma005],
      },
      { character: [eb01Doma005] },
    );
    engine.playCard(op09PortgasDAce035, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
