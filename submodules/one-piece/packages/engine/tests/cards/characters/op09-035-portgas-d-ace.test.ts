import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op09DraculeMihawk048,
  op09PortgasDAce035,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-035 Portgas.D.Ace", () => {
  test("with two rested Characters, rests an opposing Character costing 5 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09PortgasDAce035],
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
        activeDon: op09PortgasDAce035.cost,
      },
      {
        character: [eb01MountainGod018, op09DraculeMihawk048],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op09DraculeMihawk048);

    engine.playCard(op09PortgasDAce035, "south");

    const rest = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (rest?.kind !== "selectEntity") throw new Error("Expected Ace's rest choice.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the rest effect with only one rested Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09PortgasDAce035],
        character: [{ card: eb01Doma005, rested: true }],
        activeDon: op09PortgasDAce035.cost,
      },
      { character: [eb01MountainGod018] },
    );

    engine.playCard(op09PortgasDAce035, "south");

    expect(engine.getView("south").players.north.characters[0]?.rested).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
