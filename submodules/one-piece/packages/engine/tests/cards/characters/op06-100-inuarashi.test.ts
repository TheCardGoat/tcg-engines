import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op06Inuarashi100,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP06-100 Inuarashi", () => {
  test("with DON!! x2, pays one hand card to K.O. within the opponent Life cost limit", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Fourtricks025],
        character: [{ card: op06Inuarashi100, playedOnTurn: 0 }],
        activeDon: 2,
      },
      {
        life: [eb01Doma005, eb01Fourtricks025],
        character: [eb01Doma005, eb01Fourtricks025],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("south", "character", op06Inuarashi100);
    const handCostId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    engine.attachDon(inuarashiId, 2, "south");

    engine.declareAttack(inuarashiId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      handCostId,
    );

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Inuarashi's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(handCostId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(expensiveId);
  });

  test("may decline without trashing a hand card or K.O.'ing a Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Fourtricks025],
        character: [{ card: op06Inuarashi100, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { life: [eb01Doma005], character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("south", "character", op06Inuarashi100);
    const handId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.attachDon(inuarashiId, 2, "south");

    engine.declareAttack(inuarashiId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(handId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with only one attached DON!! does not offer the discard or K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Fourtricks025],
        character: [{ card: op06Inuarashi100, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { life: [eb01Doma005], character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("south", "character", op06Inuarashi100);
    const handId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    engine.attachDon(inuarashiId, 1, "south");

    engine.declareAttack(inuarashiId, engine.leader("north"), "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.prompts).toHaveLength(0);
  });

  test("plays the resolving Life Trigger card when its opponent has three Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { life: [op06Inuarashi100] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const inuarashiId = engine.findCardInZone("north", "life", op06Inuarashi100);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(inuarashiId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(inuarashiId);
    expect(view.prompts).toHaveLength(0);
  });
});
