import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op11MonkeyDLuffy040,
  op11MonkeyDLuffy058,
  op13GumGumGatlingGun021,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP13-021 Gum-Gum Gatling Gun", () => {
  test("Main gives one rested DON!! only to a Monkey.D.Luffy card, then gives -2000", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op11MonkeyDLuffy040,
        hand: [op13GumGumGatlingGun021],
        character: [op11MonkeyDLuffy058, eb01Doma005],
        activeDon: 1,
      },
      { character: [eb01MountainGod018] },
    );
    const luffyId = engine.findCardInZone("south", "character", op11MonkeyDLuffy058);
    const excludedId = engine.findCardInZone("south", "character", eb01Doma005);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const powerBefore = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === targetId)?.power;
    if (powerBefore == null) throw new Error("Expected the opposing Character power.");

    engine.playCard(op13GumGumGatlingGun021);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");
    const recipient = engine.pendingDecision("effectTargetSelection", "south");
    const recipientStep = recipient.steps[0];
    expect(recipientStep?.kind).toBe("selectEntity");
    if (recipientStep?.kind !== "selectEntity") throw new Error("Expected a Luffy recipient.");
    expect(recipientStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      luffyId,
    ]);
    expect(recipientStep.candidates.some((candidate) => candidate.ref.id === excludedId)).toBe(
      false,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [luffyId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === luffyId)?.attachedDon,
    ).toBe(1);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.power).toBe(
      powerBefore - 2000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger gives only an opposing Character -2000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op13GumGumGatlingGun021],
        deck: [eb01Doma005, eb01MountainGod018, eb01Doma005, eb01MountainGod018],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const powerBefore = engine
      .getView("north")
      .players.south.characters.find((card) => card?.instanceId === targetId)?.power;
    if (powerBefore == null) throw new Error("Expected the attacking Character power.");

    engine.declareAttack(targetId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(
      engine.getView("north").players.south.characters.find((card) => card?.instanceId === targetId)
        ?.power,
    ).toBe(powerBefore - 2000);
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
