import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01MsAllSunday079, op08SShark111 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-111 S-Shark", () => {
  test("with DON!! prevents the opponent from activating Blocker during its attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op08SShark111, attachedDon: 1, playedOnTurn: 0 }] },
      { character: [op01MsAllSunday079] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", op08SShark111);
    const blockerId = engine.findCardInZone("north", "character", op01MsAllSunday079);

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const view = engine.getView("north");
    expect(view.prompts).toHaveLength(0);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === blockerId)?.rested,
    ).toBe(false);

    const withoutDon = OnePieceTestEngine.create(
      { character: [{ card: op08SShark111, playedOnTurn: 0 }] },
      { character: [op01MsAllSunday079] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const plainAttackerId = withoutDon.findCardInZone("south", "character", op08SShark111);
    const availableBlockerId = withoutDon.findCardInZone("north", "character", op01MsAllSunday079);
    withoutDon.declareAttack(plainAttackerId, withoutDon.leader("north"), "south");
    const blocker = withoutDon.pendingDecision("battleBlocker", "north").steps[0];
    if (blocker?.kind !== "selectEntity") throw new Error("Expected the Blocker without DON!!.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(availableBlockerId);
  });

  test("Life Trigger trashes a hand card and plays the resolving card at two or less Life", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005], life: [op08SShark111, eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const sharkId = engine.findCardInZone("north", "life", op08SShark111);
    const costId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(costId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(sharkId);
    expect(view.prompts).toHaveLength(0);
  });
});
