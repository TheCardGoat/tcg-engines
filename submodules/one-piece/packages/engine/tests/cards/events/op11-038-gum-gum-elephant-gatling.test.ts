import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op10Franky014, op11GumGumElephantGatling038 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP11-038 Gum-Gum Elephant Gatling", () => {
  test("Main pays its optional rest-DON!! cost before resting the cost-5 boundary", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op11GumGumElephantGatling038], activeDon: 2 },
      { character: [eb01MountainGod018, op10Franky014] },
    );
    const selectedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op10Franky014);

    engine.playCard(op11GumGumElephantGatling038);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const decision = engine.pendingDecision("effectTargetSelection", "south");
    const step = decision.steps[0];
    expect(step?.kind).toBe("selectEntity");
    if (step?.kind !== "selectEntity") throw new Error("Expected a paid cost-5 rest choice.");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(step.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2 });
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Counter gives only the defending Leader +3000 for the battle", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [op11GumGumElephantGatling038], activeDon: 1 },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op11GumGumElephantGatling038);
    const lifeBefore = engine.getView("north").players.north.lifeCount;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("north")] },
      "north",
    );

    expect(engine.getView("north").players.north.lifeCount).toBe(lifeBefore);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
