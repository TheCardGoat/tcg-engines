import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op09DocQ090,
  op09Usopp024,
  op10Franky014,
  op10Liberation098,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP10-098 Liberation", () => {
  test("declining the first target group still permits the second group", () => {
    const engine = OnePieceTestEngine.create(
      { hand: ["OP10-098"], activeDon: 8, life: 2 },
      { character: ["EB01-005", "EB01-005"] },
    );
    const kept = engine.getView("south").players.north.characters[0]!.instanceId;
    const selected = engine.getView("south").players.north.characters[1]?.instanceId;
    if (!selected) throw new Error("Expected second opposing Character");
    engine.playCard("OP10-098");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    expect(
      engine.getView("south").players.north.characters.some((card) => card?.instanceId === kept),
    ).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selected] }, "south");
    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === kept)).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(selected);
    expect(view.prompts).toHaveLength(0);
  });

  test("Main accepts an exact two-Character deficit and resolves both independent K.O.s", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10Liberation098], activeDon: 6 },
      { character: [op10Franky014, op09Usopp024] },
    );
    const costSixId = engine.findCardInZone("north", "character", op10Franky014);
    const costFourId = engine.findCardInZone("north", "character", op09Usopp024);

    engine.playCard(op10Liberation098);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costSixId] }, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === costSixId),
    ).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costFourId] }, "south");

    expect(engine.getView("south").players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([costSixId, costFourId]),
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger separately negates one opposing Leader and one opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op09DocQ090, playedOnTurn: 0 },
        ],
      },
      { life: [op10Liberation098] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const characterId = engine.findCardInZone("south", "character", op09DocQ090);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [characterId] }, "north");

    const failure = engine.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: characterId,
      trigger: "activateMain",
    });
    expect(failure.reason).toBe("This card does not have that activation timing.");
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("uses base-cost limits for both target groups despite Issho's cost reduction", () => {
    const e = OnePieceTestEngine.create(
      { hand: ["OP10-098"], activeDon: 6, character: [{ cardId: "OP03-078", attachedDon: 1 }] },
      { character: ["ST02-013", "OP10-101", "ST09-007"] },
    );
    const seven = e.findCardInZone("north", "character", "ST02-013");
    const five = e.findCardInZone("north", "character", "OP10-101");
    const three = e.findCardInZone("north", "character", "ST09-007");
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === seven)?.cost,
    ).toBe(4);
    expect(
      e.getView("north").players.north.characters.find((c) => c?.instanceId === five)?.cost,
    ).toBe(2);
    e.asSouth().play("OP10-098");
    const first = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (first?.kind !== "selectEntity") throw new Error("Expected first target group");
    expect(first.candidates.map((c) => c.ref.id)).not.toContain(seven);
    expect(first.candidates.map((c) => c.ref.id)).toContain(five);
    e.asSouth().chooseNoTargets();
    const second = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (second?.kind !== "selectEntity") throw new Error("Expected second target group");
    expect(second.candidates.map((c) => c.ref.id)).not.toContain(five);
    expect(second.candidates.map((c) => c.ref.id)).toContain(three);
    e.asSouth().chooseTargets(three);
    expect(e.getView("north").players.north.trash.map((c) => c.instanceId)).toContain(three);
    expect(e.getView("north").players.north.characters.map((c) => c?.instanceId)).toEqual(
      expect.arrayContaining([seven, five]),
    );
  });
});
