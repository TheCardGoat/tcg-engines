import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018 } from "@tcg/op-cards";
import { op10Giolla066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP10-066 Giolla", () => {
  test("rests two DON!! and a cost-4-or-less Character only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Giolla066], activeDon: 4 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const northCharacters = engine
      .getView("north")
      .players.north.characters.flatMap((card) =>
        card ? [{ id: card.instanceId, name: card.name }] : [],
      );
    const attackers = northCharacters.filter((card) => card.name === eb01MountainGod018.name);
    const targetId = northCharacters.find((card) => card.name === eb01Doma005.name)?.id;
    const firstAttackerId = attackers[0]?.id;
    const secondAttackerId = attackers[1]?.id;
    if (!targetId || !firstAttackerId || !secondAttackerId) {
      throw new Error("Expected Giolla's test Characters.");
    }

    engine.declareAttack(firstAttackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Giolla's rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(firstAttackerId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 2 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);

    engine.declareAttack(secondAttackerId, engine.leader("south"), "north");
    expect(() => engine.pendingDecision("effectOptional", "south")).toThrow();
    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 2 });
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Giolla066], activeDon: 4 },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attackerId, engine.leader("south"), "north");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const lifeBefore = before.lifeCount;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    // Declined: no rest 2 DON!!; opposing Character stays active; Life may take the hit.
    expect(after.activeDon).toBe(4);
    expect(after.restedDon).toBe(0);
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
