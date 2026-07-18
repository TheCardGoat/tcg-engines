import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op05EmporioEnergyHormone018,
  op05Hack012,
  op05Pell014,
  op05Sabo007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function expectCompoundBoundaryCandidates(
  engine: OnePieceTestEngine,
  seat: "north",
  selectedId: string,
  tooPowerfulId: string,
  wrongTraitId: string,
) {
  const playDecision = engine.pendingDecision("effectPlaySelection", seat);
  const playStep = playDecision.steps[0];
  expect(playStep?.kind).toBe("selectEntity");
  if (playStep?.kind !== "selectEntity") {
    throw new Error("Expected a Revolutionary Army Character play choice.");
  }
  expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
  expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
  expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
}

describe("OP05-018 Emporio Energy Hormone", () => {
  test("Counter protects its chosen recipient before playing a compound-trait power-5000 Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op05EmporioEnergyHormone018, op05Hack012, op05Sabo007, op05Pell014],
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op05EmporioEnergyHormone018);
    const selectedId = engine.findCardInZone("north", "hand", op05Hack012);
    const tooPowerfulId = engine.findCardInZone("north", "hand", op05Sabo007);
    const wrongTraitId = engine.findCardInZone("north", "hand", op05Pell014);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expectCompoundBoundaryCandidates(engine, "north", selectedId, tooPowerfulId, wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.players.north.lifeCount).toBe(lifeBefore);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger plays the same boundary Character without Event payment or Counter power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op05Hack012, op05Sabo007, op05Pell014],
        life: [op05EmporioEnergyHormone018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "hand", op05Hack012);
    const tooPowerfulId = engine.findCardInZone("north", "hand", op05Sabo007);
    const wrongTraitId = engine.findCardInZone("north", "hand", op05Pell014);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expectCompoundBoundaryCandidates(engine, "north", selectedId, tooPowerfulId, wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.players.north.activeDon).toBe(0);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
