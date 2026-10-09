import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op05Gedatsu102, getCard } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-102 Gedatsu", () => {
  test("K.O.'s up to one Character whose cost does not exceed the opponent's Life count", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Gedatsu102],
        activeDon: op05Gedatsu102.cost,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op05Gedatsu102, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Gedatsu's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(tooExpensiveId);
    expect(view.prompts).toHaveLength(0);
  });
  test("Ice Age makes a higher-base-cost Character eligible, including after restoring the choice", () => {
    const iceAge = getCard("OP02-117");
    const apoo = getCard("OP01-103");
    let engine = OnePieceTestEngine.create(
      { leaderCardId: "OP03-077", hand: [iceAge, op05Gedatsu102], activeDon: 6 },
      { leaderCardId: "ST04-001", life: 1, character: [apoo] },
    );
    const targetId = engine.findCardInZone("north", "character", apoo);
    engine.asSouth().play(iceAge);
    engine.asSouth().chooseTargets(targetId);
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(0);
    engine.asSouth().play(op05Gedatsu102);
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Gedatsu's reduced-cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.asSouth().chooseTargets(targetId);
    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.north.characters.filter(Boolean)).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("an opposing Doll's continuous cost increase excludes it from Gedatsu's targets", () => {
    const doll = getCard("EB04-046");
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "ST07-001", hand: [op05Gedatsu102], activeDon: 5 },
      { leaderCardId: "ST06-001", life: 3, character: [doll] },
    );
    const dollId = engine.findCardInZone("north", "character", doll);
    expect(engine.getView("south").players.north.characters[0]?.cost).toBe(4);
    engine.asSouth().play(op05Gedatsu102);
    const view = engine.getView("south");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.characters[0]?.instanceId).toBe(dollId);
  });
});
