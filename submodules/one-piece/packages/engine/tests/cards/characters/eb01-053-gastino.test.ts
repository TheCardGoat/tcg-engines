import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01Gastino053, eb01MountainGod018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-053 Gastino", () => {
  test("maps a cost-3-or-less opposing Character and lets its controller choose bottom Life", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [eb01Gastino053], activeDon: 3 },
      {
        life: [eb01Fourtricks025],
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01Doma005);
    const excludedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(eb01Gastino053);
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Gastino's low-cost opposing Character choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") {
      throw new Error("Expected Gastino's top-or-bottom Life choice.");
    }
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.north.life.at(-1)).toBe(selectedId);
    expect(engine.getState().cards[selectedId]?.faceUp).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger maps up to two opposing Leader or Character cards for -3000 power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [eb01Gastino053] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const powerTargets = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(powerTargets?.kind).toBe("selectEntity");
    if (powerTargets?.kind !== "selectEntity") {
      throw new Error("Expected Gastino's aggregate Leader or Character power choice.");
    }
    const leaderId = engine.leader("south");
    expect(powerTargets.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([leaderId, attackerId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [leaderId, attackerId] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.south.leader.power).toBe(2000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(4000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
