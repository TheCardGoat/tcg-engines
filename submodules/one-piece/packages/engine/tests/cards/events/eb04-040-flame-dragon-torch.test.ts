import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Kaido061,
  op14eb04FlameDragonTorch040,
  op14eb04Kaido030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("EB04-040 Flame Dragon Torch", () => {
  test("pays the optional Main cost and maps the Kaido power and opposing rest choices", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01Kaido061,
        hand: [op14eb04FlameDragonTorch040],
        character: [op14eb04Kaido030, eb01Doma005],
        activeDon: 7,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
      },
    );
    const eventId = engine.findCardInZone("south", "hand", op14eb04FlameDragonTorch040);
    const kaidoCharacterId = engine.findCardInZone("south", "character", op14eb04Kaido030);
    const unrelatedCharacterId = engine.findCardInZone("south", "character", eb01Doma005);
    const selectedOpponentId = engine.findCardInZone("north", "character", eb01Doma005);
    const otherOpponentId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op14eb04FlameDragonTorch040);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const powerDecision = engine.pendingDecision("effectTargetSelection", "south");
    const powerStep = powerDecision.steps[0];
    expect(powerStep?.kind).toBe("selectEntity");
    if (powerStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the Kaido power choice.");
    }
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      engine.leader("south"),
      kaidoCharacterId,
    ]);
    expect(powerStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      unrelatedCharacterId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [kaidoCharacterId] }, "south");

    const restDecision = engine.pendingDecision("effectTargetSelection", "south");
    const restStep = restDecision.steps[0];
    expect(restStep?.kind).toBe("selectEntity");
    if (restStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the opposing Character rest choice.");
    }
    expect(restStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selectedOpponentId,
      otherOpponentId,
    ]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [selectedOpponentId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === kaidoCharacterId)?.power,
    ).toBe(12_000);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === selectedOpponentId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 7 });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === kaidoCharacterId)?.power,
    ).toBe(9000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("returns one DON!! for the Counter and applies the automatic Leader battle power", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        hand: [op14eb04FlameDragonTorch040],
        activeDon: 2,
        life: 2,
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const eventId = engine.findCardInZone("north", "hand", op14eb04FlameDragonTorch040);
    const beforeCounter = engine.getView("north").players.north;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [eventId] }, "north");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.lifeCount).toBe(beforeCounter.lifeCount);
    expect(view.players.north.activeDon + view.players.north.restedDon).toBe(
      beforeCounter.activeDon + beforeCounter.restedDon - 1,
    );
    expect(view.players.north.donDeckCount).toBe(beforeCounter.donDeckCount + 1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
