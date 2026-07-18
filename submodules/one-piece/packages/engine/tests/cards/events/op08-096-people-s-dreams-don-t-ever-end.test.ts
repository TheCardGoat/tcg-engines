import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op08Ginrummy086,
  op08PeopleSDreamsDonTEverEnd096,
  op10Marco055,
  op13Vista046,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP08-096 People's Dreams Don't Ever End!!", () => {
  test("Counter uses the actual cost-6 card trashed from the deck to offer the +5000 target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Marco055, playedOnTurn: 0 }] },
      {
        hand: [op08PeopleSDreamsDonTEverEnd096],
        deck: [op13Vista046, eb01Doma005],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op10Marco055);
    const eventId = engine.findCardInZone("north", "hand", op08PeopleSDreamsDonTEverEnd096);
    const trashedId = engine.findCardInZone("north", "deck", op13Vista046);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "north");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the conditional battle-power target.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toContain(
      engine.leader("north"),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      trashedId,
    );
    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter skips the power choice when the trashed deck card is below the threshold", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Marco055, playedOnTurn: 0 }] },
      {
        hand: [op08PeopleSDreamsDonTEverEnd096],
        deck: [eb01Doma005, op13Vista046],
        activeDon: 1,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", op10Marco055);
    const eventId = engine.findCardInZone("north", "hand", op08PeopleSDreamsDonTEverEnd096);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore - 1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers only a black cost-3-or-less Character from Trash to play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op08PeopleSDreamsDonTEverEnd096],
        trash: [op08Ginrummy086, op13Vista046],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eligibleId = engine.findCardInZone("north", "trash", op08Ginrummy086);
    const excludedId = engine.findCardInZone("north", "trash", op13Vista046);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger's filtered Trash play choice.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "north");

    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === eligibleId),
    ).toBe(true);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
