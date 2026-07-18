import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op03AirDoor094,
  op03Fukurou088,
  op03Jerry084,
  op03Kaku080,
  op03Kumadori082,
  op03RobLucci076,
  op03RobLucci092,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP03-094 Air Door", () => {
  test("maps the private top-5 CP Character search and trashes the remainder", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op03RobLucci076,
      hand: [op03AirDoor094],
      deck: [op03Jerry084, op03Kaku080, op03RobLucci092, op03AirDoor094, eb01Fourtricks025],
      activeDon: 4,
    });
    const eventId = engine.findCardInZone("south", "hand", op03AirDoor094);
    const otherEligibleId = engine.findCardInZone("south", "deck", op03Jerry084);
    const selectedId = engine.findCardInZone("south", "deck", op03Kaku080);
    const costlyId = engine.findCardInZone("south", "deck", op03RobLucci092);
    const wrongCategoryId = engine.findCardInZone("south", "deck", op03AirDoor094);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op03AirDoor094);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the private CP search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: otherEligibleId, legal: true },
      { id: selectedId, legal: true },
      { id: costlyId, legal: false },
      { id: wrongCategoryId, legal: false },
      { id: unrelatedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const onPlayDecision = engine.pendingDecision("effectOptional", "south");
    expect(onPlayDecision).toMatchObject({ actorId: "south", kind: "confirm" });

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId),
    ).toMatchObject({ rested: false });
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([eventId, otherEligibleId, costlyId, wrongCategoryId, unrelatedId]),
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 4, deckCount: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger offers only a black cost-3-or-less Character from its owner's trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op03AirDoor094],
        trash: [op03Fukurou088, op03Kumadori082, eb01Doma005],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const selectedId = engine.findCardInZone("north", "trash", op03Fukurou088);
    const costlyId = engine.findCardInZone("north", "trash", op03Kumadori082);
    const wrongColorId = engine.findCardInZone("north", "trash", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const playDecision = engine.pendingDecision("effectPlaySelection", "north");
    const playStep = playDecision.steps[0];
    expect(playStep?.kind).toBe("selectEntity");
    if (playStep?.kind !== "selectEntity") {
      throw new Error("Expected the damaged player to choose a low-cost black Character.");
    }
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).toEqual([selectedId]);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(costlyId);
    expect(playStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongColorId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [selectedId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.characters.some((card) => card?.instanceId === selectedId)).toBe(
      true,
    );
    expect(view.players.north).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
