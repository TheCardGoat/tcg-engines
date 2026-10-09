import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op09BlackHole098,
  op09DocQ090,
  op09MarshallDTeach081,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-098 Black Hole", () => {
  test("Main accepts the included Leader type and K.O.s the same negated cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op09MarshallDTeach081,
        hand: [op09BlackHole098],
        activeDon: 4,
      },
      { character: [op09DocQ090, eb01MountainGod018] },
    );
    const selectedId = engine.findCardInZone("north", "character", op09DocQ090);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op09BlackHole098);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selectedId);
    expect(view.players.north.characters.some((card) => card?.instanceId === highCostId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger negates an opposing Character without activating Main or paying its cost", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op09DocQ090, playedOnTurn: 0 },
        ],
      },
      { life: [op09BlackHole098] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const targetId = engine.findCardInZone("south", "character", op09DocQ090);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: targetId,
      trigger: "activateMain",
    });
    expect(failure.reason).toBe("This card does not have that activation timing.");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("FAQ: external cost reduction survives negation and makes Jack eligible for KO", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", hand: ["OP07-096", "OP09-098"], activeDon: 5, trash: 10 },
      { character: ["OP08-084"] },
    );
    const jack = e.findCardInZone("north", "character", "OP08-084");
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(11);
    e.asSouth().play("OP07-096");
    e.asSouth().chooseTargets(jack);
    expect(e.getView("north").players.north.characters[0]?.cost).toBe(8);
    e.asSouth().play("OP09-098");
    e.asSouth().chooseTargets(jack);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(jack);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("negates OnKO before KO so Lucky Roux cannot KO an available Character", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP09-081", hand: ["OP09-098"], character: ["ST02-012"], activeDon: 4 },
      { leaderCardId: "OP09-001", character: ["OP09-015"] },
    );
    const id = e.findCardInZone("north", "character", "OP09-015");
    const availableTarget = e.findCardInZone("south", "character", "ST02-012");
    e.asSouth().play("OP09-098");
    e.asSouth().chooseTargets(id);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(id);
    expect(
      e.getView("south").players.south.characters.some((c) => c?.instanceId === availableTarget),
    ).toBe(true);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
  test("FAQ: Life Trigger negates Nami before subsequent empty-deck loss", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "OP03-040", hand: ["P-096"], deck: ["ST02-012"], activeDon: 2 },
      { life: ["OP09-098"] },
    );
    e.asSouth().attack(e.leader("south"), e.leader("north"));
    e.asNorth().activateLifeTrigger();
    e.asNorth().chooseTargets(e.leader("south"));
    e.asSouth().play("P-096");
    expect(e.getView("south")).toMatchObject({
      status: "finished",
      winner: "north",
      finishReason: "emptyDeck",
    });
  });
});
