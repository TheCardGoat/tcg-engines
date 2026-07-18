import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Pell014,
  op09GumGumGiant078,
  op09MonkeyDLuffy061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-078 Gum-Gum Giant", () => {
  test("Counter pays both optional costs before granting included-type power and drawing two", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        leaderCardId: op09MonkeyDLuffy061,
        hand: [op09GumGumGiant078, eb01Doma005, op05Pell014],
        deck: [eb01Doma005, op05Pell014],
        life: 2,
        activeDon: 3,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op09GumGumGiant078);
    const paymentId = engine.findCardInZone("north", "hand", eb01Doma005);
    const handBefore = engine.getView("north").players.north.hand.length;
    const donDeckBefore = engine.getView("north").players.north.donDeckCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: ["active-don:0", "rested-don:0"] },
      "north",
    );
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [paymentId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    const view = engine.getView("north");
    expect(view.logs.some((entry) => entry.message.includes("+4000 power this battle"))).toBe(true);
    expect(view.players.north.hand).toHaveLength(handBefore);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(paymentId);
    expect(view.players.north.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
