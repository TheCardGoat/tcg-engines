import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09Yasopp013, op11GlorpWeb019 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-019 Glorp Web!!", () => {
  test("Counter maps independent battle and turn power recipients at the 6000-power gate", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09Yasopp013, playedOnTurn: 0 }] },
      {
        hand: [op11GlorpWeb019],
        character: [eb01Doma005],
        activeDon: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op09Yasopp013);
    const eventId = engine.findCardInZone("north", "hand", op11GlorpWeb019);
    const turnRecipientId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [turnRecipientId] }, "north");

    const view = engine.getView("north");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === turnRecipientId)?.power,
    ).toBe(4000);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger gives one Leader or Character +1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op11GlorpWeb019] },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.leader.power).toBe(6000);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
