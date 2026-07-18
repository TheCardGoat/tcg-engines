import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op12Issho082,
  op12TrafalgarLaw106,
  op13GumGumDawnStamp117,
  op13PortgasDAce002,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-002 Portgas.D.Ace", () => {
  test("draws after taking ordinary damage from a Life card without a Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13PortgasDAce002,
        hand: [eb01Doma005],
        life: [eb01Doma005],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
    );
    const attackerId = engine.findCardInZone("north", "character", op12Issho082);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(0);
    expect(engine.getView("south").players.south.hand).toHaveLength(3);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("reduces an opposing attacker, then draws only after the damage Trigger resolves", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op13PortgasDAce002,
        hand: [eb01Doma005, eb01Doma005],
        life: [op13GumGumDawnStamp117],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
    );
    const attackerId = engine.findCardInZone("north", "character", op12Issho082);
    const paymentId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.attachDon(engine.leader("south"), 1, "south");
    engine.endTurn("south");
    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [attackerId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === attackerId)?.power,
    ).toBe(8000);
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
    expect(engine.pendingDecision("lifeTrigger", "south")).toBeDefined();
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "south");

    expect(engine.getView("south").players.south.hand).toHaveLength(3);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("draws when its qualifying Character is K.O.'d in battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op12Issho082, playedOnTurn: 0 }] },
      {
        leaderCardId: op13PortgasDAce002,
        character: [{ card: op12TrafalgarLaw106, rested: true, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Doma005],
        activeDon: 1,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const targetId = engine.findCardInZone("north", "character", op12TrafalgarLaw106);

    engine.attachDon(engine.leader("north"), 1, "north");
    engine.endTurn("north");
    engine.declareAttack(
      engine.findCardInZone("south", "character", op12Issho082),
      targetId,
      "south",
    );

    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
