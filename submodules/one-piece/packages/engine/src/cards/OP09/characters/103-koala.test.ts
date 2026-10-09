import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05BeloBetty015 } from "@tcg/op-cards";
import { op09Koala103 } from "../../../../../cards/src/cards/characters/op09-103-koala.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-103 Koala", () => {
  test("pays bottom Life, plays the selected cost-four Revolutionary Army Character and draws", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Koala103, "OP09-108", eb01Doma005],
      life: [eb01Doma005, "EB01-025"],
      deck: [eb01Doma005, eb01Doma005, eb01Doma005],
      activeDon: op09Koala103.cost,
    });
    const bottom = engine.findCardInZone("south", "life", "EB01-025");
    const kuma = engine.findCardInZone("south", "hand", "OP09-108");
    const ineligible = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.asSouth().play(op09Koala103);
    engine.asSouth().acceptOptional();
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Koala play choice");
    expect(play.candidates.filter((c) => c.legal).map((c) => c.ref.id)).toContain(kuma);
    expect(play.candidates.filter((c) => c.legal).map((c) => c.ref.id)).not.toContain(ineligible);
    engine.asSouth().choosePlay(kuma);
    expect(engine.getView("south").players.south.characters.map((c) => c?.instanceId)).toContain(
      kuma,
    );
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(bottom);
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").players.south.lifeCount).toBe(1);
  });

  test("may pay top Life then decline the play without drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Koala103, "OP09-108"],
      life: [eb01Doma005, "EB01-025"],
      deck: [eb01Doma005, eb01Doma005],
      activeDon: op09Koala103.cost,
    });
    const top = engine.findCardInZone("south", "life", eb01Doma005);
    engine.asSouth().play(op09Koala103);
    engine.asSouth().acceptOptional();
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "top" }, "south");
    engine.asSouth().chooseNoPlay();
    expect(engine.getView("south").players.south.deckCount).toBe(2);
    expect(engine.getView("south").players.south.hand.map((c) => c.instanceId)).toContain(top);
    expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(1);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Koala103, op05BeloBetty015],
      life: [eb01Doma005, eb01Doma005],
      deck: [eb01Doma005],
      activeDon: op09Koala103.cost,
    });
    engine.playCard(op09Koala103, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("uses Blocker independently of paying its On Play cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op09Koala103] },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const koala = engine.findCardInZone("south", "character", op09Koala103);
    const life = engine.getView("south").players.south.lifeCount;
    engine.asNorth().attack(engine.leader("north"), engine.leader("south"));
    engine.asSouth().chooseBlocker(koala);
    expect(
      engine.getView("south").players.south.characters.find((c) => c?.instanceId === koala)?.rested,
    ).toBe(true);
    expect(engine.getView("south").players.south.lifeCount).toBe(life);
  });
});
