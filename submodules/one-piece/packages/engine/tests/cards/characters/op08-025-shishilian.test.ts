import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op08Shishilian025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-025 Shishilian", () => {
  test("on play freezes only an opposing rested cost-3-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op08Shishilian025], activeDon: op08Shishilian025.cost },
      {
        character: [
          { card: eb01Fourtricks025, rested: true },
          { card: eb01MountainGod018, rested: true },
          eb01Doma005,
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const expensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const activeId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op08Shishilian025, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Shishilian's freeze choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    engine.endTurn("north");
    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
  });
});
