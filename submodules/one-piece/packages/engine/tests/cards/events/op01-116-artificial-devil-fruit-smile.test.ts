import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01BaoHuang105,
  op01Hajrudin018,
  op01ArtificialDevilFruitSmile116,
  op01HitokiriKamazo108,
  op01SheepSHorn117,
  op01Speed104,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

describe("OP01-116 Artificial Devil Fruit SMILE", () => {
  test("maps the private top-5 SMILE Character search, plays the choice, and orders the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01ArtificialDevilFruitSmile116],
      deck: [
        eb01Fourtricks025,
        op01Speed104,
        op01HitokiriKamazo108,
        op01SheepSHorn117,
        eb01Doma005,
      ],
      activeDon: 2,
    });
    const eventId = engine.findCardInZone("south", "hand", op01ArtificialDevilFruitSmile116);
    const selectedId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const otherEligibleId = engine.findCardInZone("south", "deck", op01Speed104);
    const costlyId = engine.findCardInZone("south", "deck", op01HitokiriKamazo108);
    const wrongCategoryId = engine.findCardInZone("south", "deck", op01SheepSHorn117);
    const unrelatedId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op01ArtificialDevilFruitSmile116);

    const searchDecision = engine.pendingDecision("effectSearchSelection", "south");
    const searchStep = searchDecision.steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller to receive the private SMILE search choice.");
    }
    expect(
      searchStep.candidates.map((candidate) => ({
        id: candidate.ref.id,
        legal: candidate.legal,
      })),
    ).toEqual([
      { id: selectedId, legal: true },
      { id: otherEligibleId, legal: true },
      { id: costlyId, legal: false },
      { id: wrongCategoryId, legal: false },
      { id: unrelatedId, legal: false },
    ]);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");

    const orderDecision = engine.pendingDecision("effectSearchRemainderOrder", "south");
    const orderStep = orderDecision.steps[0];
    expect(orderStep?.kind).toBe("orderItems");
    if (orderStep?.kind !== "orderItems") {
      throw new Error("Expected the controller to order the unplayed cards at the bottom.");
    }
    const remainderOrder = [unrelatedId, wrongCategoryId, costlyId, otherEligibleId];
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === selectedId),
    ).toMatchObject({ rested: false });
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eventId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2, deckCount: 4 });
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger activates Main, plays Bao Huang, and resolves its On Play reveal", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, op01Hajrudin018],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
      },
      {
        life: [op01ArtificialDevilFruitSmile116],
        deck: [
          op01BaoHuang105,
          op01Speed104,
          op01HitokiriKamazo108,
          op01SheepSHorn117,
          eb01Fourtricks025,
        ],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const baoHuangId = engine.findCardInZone("north", "deck", op01BaoHuang105);
    const firstHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondHandId = engine.findCardInZone("south", "hand", op01Hajrudin018);
    const activeDonBeforeTrigger = engine.getView("north").players.north.activeDon;

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [baoHuangId] }, "north");

    const remainderStep = engine.pendingDecision("effectSearchRemainderOrder", "north").steps[0];
    expect(remainderStep?.kind).toBe("orderItems");
    if (remainderStep?.kind !== "orderItems") {
      throw new Error("Expected the Trigger search remainder ordering choice.");
    }
    const remainderOrder = remainderStep.candidates.map((candidate) => candidate.ref.id);
    expect(remainderOrder).toHaveLength(4);
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: remainderOrder! }, "north");

    const revealStep = engine.pendingDecision("effectRevealFromHandSelection", "north").steps[0];
    expect(revealStep?.kind).toBe("selectEntity");
    if (revealStep?.kind !== "selectEntity") {
      throw new Error("Expected Bao Huang's nested On Play reveal choice.");
    }
    expect(revealStep).toMatchObject({ min: 2, max: 2 });
    expect(revealStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(firstHandId);
    expect(revealStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(secondHandId);
    engine.resolveDecision(
      "effectRevealFromHandSelection",
      { selectedIds: revealStep.candidates.slice(0, 2).map((candidate) => candidate.ref.id) },
      "north",
    );

    const view = engine.getView("north");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(baoHuangId);
    expect(view.players.north.activeDon).toBe(activeDonBeforeTrigger);
    expect(
      view.logs.some(
        (entry) =>
          entry.message.includes(eb01Doma005.name) && entry.message.includes(op01Hajrudin018.name),
      ),
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("places all five looked-at cards at the bottom in the chosen order when none are eligible", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op01ArtificialDevilFruitSmile116],
      deck: [
        op01HitokiriKamazo108,
        op01SheepSHorn117,
        eb01Doma005,
        eb01MountainGod018,
        op01Hajrudin018,
      ],
      activeDon: 2,
    });
    const lookedIds = [...engine.getState().players.south.deck];

    engine.playCard(op01ArtificialDevilFruitSmile116);

    const searchStep = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(searchStep?.kind).toBe("selectEntity");
    if (searchStep?.kind !== "selectEntity") {
      throw new Error("Expected an optional search choice even with no eligible Character.");
    }
    expect(searchStep.candidates.every((candidate) => !candidate.legal)).toBe(true);
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const chosenOrder = [...lookedIds].reverse();
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: chosenOrder }, "south");

    expect(engine.getState().players.south.deck).toEqual(chosenOrder);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
