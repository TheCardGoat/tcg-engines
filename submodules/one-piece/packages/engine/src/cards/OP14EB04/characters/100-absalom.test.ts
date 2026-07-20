import {
  eb01Doma005,
  eb01MountainGod018,
  op06GeckoMoria086,
  op06Inuppe082,
  op12Perona034,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Absalom100 } from "../../../../../cards/src/cards/OP14EB04/characters/100-absalom.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-100 Absalom", () => {
  test("on K.O. privately reveals an included top-three card and orders the remainder on deck bottom", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Absalom100],
        deck: [op12Perona034, op06Inuppe082, eb01Doma005, eb01MountainGod018],
      },
      { hand: [op12UrsaShock096], activeDon: op12UrsaShock096.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sourceId = engine.findCardInZone("south", "character", op14eb04Absalom100);
    const selectedId = engine.findCardInZone("south", "deck", op12Perona034);
    const exactTraitId = engine.findCardInZone("south", "deck", op06Inuppe082);
    const wrongTraitId = engine.findCardInZone("south", "deck", eb01Doma005);
    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "north");
    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    if (search?.kind !== "selectEntity") throw new Error("Expected Absalom's search choice.");
    expect(search.candidates.find((candidate) => candidate.ref.id === selectedId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === exactTraitId)?.legal).toBe(
      true,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === wrongTraitId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [selectedId] }, "south");
    const remainder = engine.pendingDecision("effectSearchRemainderOrder", "south").steps[0];
    if (remainder?.kind !== "orderItems") throw new Error("Expected bottom-deck ordering.");
    const order = [wrongTraitId, exactTraitId];
    engine.resolveDecision("effectSearchRemainderOrder", { selectedIds: order }, "south");
    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(selectedId);
    expect(engine.getState().players.south.deck.slice(-2)).toEqual(order);
    expect(view.prompts).toHaveLength(0);
  });

  test("Life Trigger offers only included cost-4-or-less trash Characters and plays the selection rested", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        life: [op14eb04Absalom100, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        trash: [op12Perona034, op06Inuppe082, op06GeckoMoria086, eb01Doma005],
        deck: [eb01MountainGod018],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const candidateId = engine.findCardInZone("north", "trash", op12Perona034);
    const exactId = engine.findCardInZone("north", "trash", op06Inuppe082);
    const expensiveId = engine.findCardInZone("north", "trash", op06GeckoMoria086);
    const wrongTraitId = engine.findCardInZone("north", "trash", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "north").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Absalom's trash-play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([candidateId, exactId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [candidateId] }, "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === candidateId),
    ).toMatchObject({ rested: true });
    expect(engine.getView("north").prompts).toHaveLength(0);
  });
});
