import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { op13JewelryBonney108 } from "../../../../../cards/src/cards/OP13/characters/108-jewelry-bonney.ts";
import { op13JewelryBonney109 } from "../../../../../cards/src/cards/OP13/characters/109-jewelry-bonney.ts";
import { op13PortgasDAce119 } from "../../../../../cards/src/cards/OP13/characters/119-portgas-d-ace.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-119 Portgas.D.Ace", () => {
  test("at three Life gains Rush, while at four Life cannot attack on its play turn", () => {
    const enabled = OnePieceTestEngine.create(
      { hand: [op13PortgasDAce119], life: 3, activeDon: op13PortgasDAce119.cost },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const enabledTargetId = enabled.findCardInZone("north", "character", eb01Doma005);
    enabled.playCard(op13PortgasDAce119, "south");
    enabled.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    enabled.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const enabledAceId = enabled.findCardInZone("south", "character", op13PortgasDAce119);
    enabled.declareAttack(enabledAceId, enabledTargetId, "south");
    expect(
      enabled
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === enabledAceId)?.rested,
    ).toBe(true);

    const disabled = OnePieceTestEngine.create(
      { hand: [op13PortgasDAce119], life: 4, activeDon: op13PortgasDAce119.cost },
      { character: [{ card: eb01Doma005, rested: true }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const disabledTargetId = disabled.findCardInZone("north", "character", eb01Doma005);
    disabled.playCard(op13PortgasDAce119, "south");
    disabled.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    disabled.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const disabledAceId = disabled.findCardInZone("south", "character", op13PortgasDAce119);
    expect(
      disabled.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: disabledAceId,
        targetId: disabledTargetId,
      }).accepted,
    ).toBe(false);
  });

  test("returning a cost-5 Character lets the opponent choose and play a cost-4-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13PortgasDAce119],
        activeDon: op13PortgasDAce119.cost,
        restedDon: 1,
      },
      {
        character: [eb01Fourtricks025],
        hand: [eb01Doma005, op13JewelryBonney108],
      },
    );
    const returnedId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const playableId = engine.findCardInZone("north", "hand", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "hand", op13JewelryBonney108);

    engine.playCard(op13PortgasDAce119, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Ace's return target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(returnedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected the opponent's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(playableId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(returnedId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(returnedId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(playableId);
    expect(view.prompts).toHaveLength(0);
  });

  test("giving a rested DON is independent, and choosing no return suppresses the opponent play", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13PortgasDAce119],
        activeDon: op13PortgasDAce119.cost,
        restedDon: 1,
      },
      { character: [op13JewelryBonney109], hand: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", op13JewelryBonney109);
    const opponentHandId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op13PortgasDAce119, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("north");
    expect(view.players.south.leader.attachedDon).toBe(1);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(targetId);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(opponentHandId);
    expect(view.prompts).toHaveLength(0);
  });

  test("after a return the opponent may decline to play a Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13PortgasDAce119], activeDon: op13PortgasDAce119.cost },
      { character: [eb01Fourtricks025], hand: [eb01Doma005] },
    );
    const returnedId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const retainedId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.playCard(op13PortgasDAce119, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [returnedId] }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([returnedId, retainedId]),
    );
    expect(view.prompts).toHaveLength(0);
  });
});
