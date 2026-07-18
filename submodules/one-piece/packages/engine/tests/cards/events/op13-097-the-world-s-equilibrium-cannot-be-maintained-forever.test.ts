import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op13SaintJalmac085,
  op13TheWorldSEquilibriumCannotBeMaintainedForever097,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-097 The World's Equilibrium Cannot Be Maintained Forever", () => {
  test("Main rests five DON!! and K.O.s a base-cost-6-or-less Character when all own Characters qualify", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op13TheWorldSEquilibriumCannotBeMaintainedForever097],
        character: [op13SaintJalmac085],
        activeDon: 6,
      },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op13TheWorldSEquilibriumCannotBeMaintainedForever097);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(targetId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives the defending Leader enough power to stop the attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [op13TheWorldSEquilibriumCannotBeMaintainedForever097],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone(
      "north",
      "hand",
      op13TheWorldSEquilibriumCannotBeMaintainedForever097,
    );
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
