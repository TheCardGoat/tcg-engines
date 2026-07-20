import {
  eb01Doma005,
  op02Vista011,
  op05Vergo023,
  op10DonquixoteDoflamingo071,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Sugar063 } from "../../../../../cards/src/cards/OP14EB04/characters/063-sugar.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-063 Sugar", () => {
  test("on play may add one DON from the DON deck active", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Sugar063],
      activeDon: op14eb04Sugar063.cost,
      donDeckCount: 1,
    });

    engine.playCard(op14eb04Sugar063, "south");
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    if (addDon?.kind !== "chooseOption") throw new Error("Expected Sugar's active DON choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 1, donDeckCount: 0 });
    expect(view.prompts).toHaveLength(0);
  });

  test("on play may choose not to add a DON", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04Sugar063],
      activeDon: op14eb04Sugar063.cost,
      donDeckCount: 1,
    });

    engine.playCard(op14eb04Sugar063, "south");
    engine.resolveDecision("effectAddDon", { optionId: "0" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, donDeckCount: 1 });
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. at six opposing DON offers an included Donquixote Pirates Character costing 5 or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04Sugar063],
        hand: [op05Vergo023, op10DonquixoteDoflamingo071, eb01Doma005],
      },
      { hand: [op02Vista011], activeDon: 6 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sugarId = engine.findCardInZone("south", "character", op14eb04Sugar063);
    const eligibleId = engine.findCardInZone("south", "hand", op05Vergo023);
    const expensiveId = engine.findCardInZone("south", "hand", op10DonquixoteDoflamingo071);
    const wrongTraitId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sugarId] }, "north");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Sugar's hand-play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sugarId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. below six opposing DON does not offer a hand play", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04Sugar063], hand: [op05Vergo023] },
      { hand: [op02Vista011], activeDon: 5 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sugarId = engine.findCardInZone("south", "character", op14eb04Sugar063);
    const retainedId = engine.findCardInZone("south", "hand", op05Vergo023);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sugarId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(retainedId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(retainedId);
    expect(view.prompts).toHaveLength(0);
  });
});
