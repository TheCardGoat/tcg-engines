import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op05Pell014,
  op09ComeOnWeLlFightYou020,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP09-020 Come On!! We'll Fight You!!", () => {
  test("Main searches an included Red-Haired Pirates type while excluding its own name and ordering the remainder", () => {
    const deck = [
      op01Shanks120,
      op09ComeOnWeLlFightYou020,
      eb01Doma005,
      op05Pell014,
      eb01Fourtricks025,
      eb01MountainGod018,
    ];
    const engine = OnePieceTestEngine.create({
      hand: [op09ComeOnWeLlFightYou020],
      deck,
      activeDon: 1,
    });
    const selectedId = engine.findCardInZone("south", "deck", op01Shanks120);
    const excludedId = engine.findCardInZone("south", "deck", op09ComeOnWeLlFightYou020);
    const revealedIds = engine.getState().players.south.deck.slice(0, 5);

    engine.playCard(op09ComeOnWeLlFightYou020);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the filtered Red-Haired Pirates search choice.");
    }
    expect(searchStep.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(searchStep.candidates.find((candidate) => candidate.ref.id === excludedId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    engine.resolveDecision(
      "effectSearchRemainderOrder",
      { selectedIds: revealedIds.filter((instanceId) => instanceId !== selectedId).reverse() },
      "south",
    );

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      selectedId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger draws one without paying the Main Event cost", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op09ComeOnWeLlFightYou020],
        deck: [eb01Doma005, eb01Fourtricks025, op05Pell014],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const drawnId = engine.findCardInZone("north", "deck", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expect(engine.getView("north").players.north.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
