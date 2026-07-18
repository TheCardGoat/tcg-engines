import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  eb02Crocodile023,
  op02ArabesqueBrickFist067,
  op06Hyouzou034,
  op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB02-023 Crocodile", () => {
  test("reorders only after your effect returns an opposing Character to hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040,
          op02ArabesqueBrickFist067,
          op02ArabesqueBrickFist067,
        ],
        character: [{ card: eb02Crocodile023, playedOnTurn: 0 }],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
        activeDon: 9,
      },
      {
        character: [{ card: eb01Doma005, rested: true }, eb01Fourtricks025, op06Hyouzou034],
      },
    );
    const firstTargetId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondTargetId = engine.findCardInZone("north", "character", eb01Fourtricks025);
    const thirdTargetId = engine.findCardInZone("north", "character", op06Hyouzou034);

    engine.playCard(op10TheWeakDoNotHaveTheRightToChooseHowTheyDie040, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstTargetId] }, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);

    engine.playCard(op02ArabesqueBrickFist067, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [secondTargetId] }, "south");

    const order = engine.pendingDecision("effectRearrangeDeckOrder", "south").steps[0];
    expect(order?.kind).toBe("orderItems");
    if (order?.kind !== "orderItems") throw new Error("Expected Crocodile's top-deck order.");
    const chosenOrder = order.candidates.map((candidate) => candidate.ref.id).reverse();
    engine.resolveDecision("effectRearrangeDeckOrder", { selectedIds: chosenOrder }, "south");
    const position = engine.pendingDecision("effectRearrangeDeckPosition", "south").steps[0];
    expect(position?.kind).toBe("chooseOption");
    if (position?.kind !== "chooseOption") throw new Error("Expected Crocodile's deck position.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectRearrangeDeckPosition", { optionId: "bottom" }, "south");

    expect(engine.getState().players.south.deck.slice(-3)).toEqual(chosenOrder);

    engine.playCard(op02ArabesqueBrickFist067, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [thirdTargetId] }, "south");

    expect(engine.getState().players.north.hand).toContain(thirdTargetId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
