import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08SilversRayleigh118,
  op09MonkeyDLuffy036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-036 Monkey.D.Luffy", () => {
  test("offers one opposing DON!!-or-Character rest choice and applies the Character cost cap", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op09MonkeyDLuffy036],
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
        activeDon: op09MonkeyDLuffy036.cost,
      },
      {
        character: [eb01MountainGod018, op08SilversRayleigh118],
        activeDon: 1,
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const expensiveId = engine.findCardInZone("north", "character", op08SilversRayleigh118);

    engine.playCard(op09MonkeyDLuffy036, "south");

    const rest = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    expect(rest).toMatchObject({ kind: "payCost", min: 0, max: 1 });
    if (rest?.kind !== "payCost") throw new Error("Expected Luffy's mixed rest choice.");
    expect(rest.candidates.map((candidate) => candidate.ref.id)).toEqual([
      eligibleId,
      "active-don:north:0",
    ]);
    expect(rest.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.players.north.activeDon).toBe(1);
    expect(view.players.north.restedDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
  });
});
