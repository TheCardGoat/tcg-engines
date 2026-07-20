import { eb01MountainGod018, op04GumGumRedRoc056 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02TrafalgarLawPrb02002002 } from "../../../../../cards/src/cards/PRB02/characters/002-trafalgar-law-prb02-002.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function targetLawWithRedRoc(engine: OnePieceTestEngine, lawId: string) {
  engine.playCard(op04GumGumRedRoc056, "north");
  const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
  if (target?.kind !== "selectEntity") throw new Error("Expected Red Roc's removal target.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lawId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [lawId] }, "north");
}

describe("PRB02-002 Trafalgar Law", () => {
  test("when attacking gives one selected opposing Character minus 2000 for this turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: prb02TrafalgarLawPrb02002002, playedOnTurn: 0 }] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lawId = engine.findCardInZone("south", "character", prb02TrafalgarLawPrb02002002);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(lawId, engine.leader("north"), "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Law's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(5000);
    engine.endTurn("south");
    const view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the optional attack target without changing its power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: prb02TrafalgarLawPrb02002002, playedOnTurn: 0 }] },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const lawId = engine.findCardInZone("south", "character", prb02TrafalgarLawPrb02002002);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(lawId, engine.leader("north"), "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("once per turn may lose power instead of opponent-effect removal of itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02TrafalgarLawPrb02002002] },
      {
        hand: [op04GumGumRedRoc056, op04GumGumRedRoc056],
        activeDon: op04GumGumRedRoc056.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", prb02TrafalgarLawPrb02002002);

    targetLawWithRedRoc(engine, lawId);
    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(lawId);
    expect(view.players.south.characters.find((card) => card?.instanceId === lawId)?.power).toBe(
      5000,
    );

    targetLawWithRedRoc(engine, lawId);
    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(lawId);
    expect(engine.findCardInZone("south", "deck", prb02TrafalgarLawPrb02002002)).toBe(lawId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the replacement and be removed by the opponent's effect", () => {
    const engine = OnePieceTestEngine.create(
      { character: [prb02TrafalgarLawPrb02002002] },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", prb02TrafalgarLawPrb02002002);

    targetLawWithRedRoc(engine, lawId);
    engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(lawId);
    expect(engine.findCardInZone("south", "deck", prb02TrafalgarLawPrb02002002)).toBe(lawId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: prb02TrafalgarLawPrb02002002, rested: true }] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const lawId = engine.findCardInZone("south", "character", prb02TrafalgarLawPrb02002002);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, lawId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(lawId);
    expect(view.prompts).toHaveLength(0);
  });
});
