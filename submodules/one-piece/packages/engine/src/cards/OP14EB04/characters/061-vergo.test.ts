import { eb01Doma005, op04GumGumRedRoc056, op05Vergo023 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Vergo061 } from "../../../../../cards/src/cards/OP14EB04/characters/061-vergo.ts";

import { OnePieceTestEngine } from "../../../index.ts";

function targetWithRedRoc(engine: OnePieceTestEngine, targetId: string) {
  engine.playCard(op04GumGumRedRoc056, "north");
  engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");
}

describe("OP14-061 Vergo", () => {
  test("once per turn may return one DON instead of opponent-effect removal of an included Donquixote Pirates Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Vergo061, op05Vergo023], activeDon: 2 },
      {
        hand: [op04GumGumRedRoc056, op04GumGumRedRoc056],
        activeDon: op04GumGumRedRoc056.cost * 2,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vergoId = engine.findCardInZone("south", "character", op14eb04Vergo061);
    const protectedId = engine.findCardInZone("south", "character", op05Vergo023);
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    targetWithRedRoc(engine, protectedId);
    expect(engine.pendingDecision("effectRemovalReplacement", "south").actorId).toBe("south");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    const returnDon = engine.pendingDecision("effectReturnDon", "south").steps[0];
    if (returnDon?.kind !== "payCost") throw new Error("Expected Vergo's DON return.");
    engine.resolveDecision(
      "effectReturnDon",
      { selectedIds: [returnDon.candidates[0]!.ref.id] },
      "south",
    );

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });

    targetWithRedRoc(engine, vergoId);
    view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(vergoId);
    expect(view.players.south.deckCount).toBe(deckCountBefore + 1);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the removal replacement and let the Character return to hand", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Vergo061], activeDon: 1 },
      { hand: [op04GumGumRedRoc056], activeDon: op04GumGumRedRoc056.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const vergoId = engine.findCardInZone("south", "character", op14eb04Vergo061);
    const deckCountBefore = engine.getView("south").players.south.deckCount;

    targetWithRedRoc(engine, vergoId);
    engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(vergoId);
    expect(view.players.south.deckCount).toBe(deckCountBefore + 1);
    expect(view.players.south.activeDon).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("when attacking may return one DON to give an opposing Character minus 2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Vergo061, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const vergoId = engine.findCardInZone("south", "character", op14eb04Vergo061);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(vergoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Vergo's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      (eb01Doma005.power ?? 0) - 2000,
    );
    engine.endTurn("south");
    view = engine.getView("north");
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline the when-attacking DON return without changing the target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op14eb04Vergo061, playedOnTurn: 0 }], activeDon: 1 },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const vergoId = engine.findCardInZone("south", "character", op14eb04Vergo061);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(vergoId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.activeDon).toBe(1);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      eb01Doma005.power,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
