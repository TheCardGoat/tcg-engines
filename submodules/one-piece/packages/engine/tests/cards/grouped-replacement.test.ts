import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("simultaneous Character removal replacements", () => {
  test.each(["OP01-051", "OP13-109"])(
    "declining preserves deck order across interleaved %s",
    (middleCard) => {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP02-117", "OP05-058"], activeDon: 9 },
        { character: ["EB01-005", middleCard, "EB01-005", "OP15-009"] },
      );
      const targets = engine
        .getView("north")
        .players.north.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));
      const middleId = engine.findCardInZone("north", "character", middleCard);

      engine.asSouth().play("OP02-117");
      engine.asSouth().chooseTargets(middleId);
      engine.asSouth().play("OP05-058");
      engine.asNorth().orderCards("effectReturnToDeckOwnerOrder", targets);
      engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "north");

      if (middleCard === "OP13-109") {
        // Bonney has a separate replacement; declining it must retain Koby's earlier group decline.
        engine.resolveDecision("effectRemovalReplacement", { optionId: "no" }, "north");
      }
      expect(engine.getView("north").prompts).toHaveLength(0);
      // Verify exact physical order after movement into the opponent's hidden deck.
      expect(engine.getState().players.north.deck.slice(-targets.length)).toEqual(targets);
      expect(engine.getView("north").players.north.leader?.power).toBe(5000);
    },
  );

  test("declining Koby lets the whole K.O. group leave without another offer (Q1179)", () => {
    const engine = OnePieceTestEngine.create(
      { leaderCardId: "OP01-091", hand: ["OP01-094"], activeDon: 10 },
      { character: ["EB01-005", "OP15-009"] },
    );
    const targets = engine
      .getView("north")
      .players.north.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));

    engine.asSouth().play("OP01-094");
    engine.asSouth().acceptOptional();
    engine.asNorth().declineKoReplacement();

    const view = engine.getView("north");
    expect(view.prompts).toHaveLength(0);
    expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(targets),
    );
    expect(view.players.north.leader?.power).toBe(5000);
  });

  test.each(["yes", "no"])(
    "Koby handles a mass deck return as one group when choosing %s",
    (optionId) => {
      const engine = OnePieceTestEngine.create(
        { hand: ["OP05-058"], activeDon: 8 },
        { character: ["EB01-005", "EB01-005", "OP15-009"] },
      );
      const targets = engine
        .getView("north")
        .players.north.characters.flatMap((card) => (card?.instanceId ? [card.instanceId] : []));
      const deckBefore = engine.getView("north").players.north.deckCount;

      engine.asSouth().play("OP05-058");
      engine.asNorth().orderCards("effectReturnToDeckOwnerOrder", targets);
      engine.resolveDecision("effectRemovalReplacement", { optionId }, "north");

      const view = engine.getView("north");
      expect(view.prompts).toHaveLength(0);
      expect(view.players.north.deckCount).toBe(
        deckBefore + (optionId === "no" ? targets.length : 0),
      );
      expect(view.players.north.leader?.power).toBe(optionId === "yes" ? 3000 : 5000);
      // Koby's printed cost is 1, so it belongs to the same affected group.
      expect(
        view.players.north.characters.flatMap((card) =>
          card?.instanceId ? [card.instanceId] : [],
        ),
      ).toEqual(optionId === "yes" ? targets : []);
      if (optionId === "no")
        expect(engine.getState().players.north.deck.slice(-targets.length)).toEqual(targets);
    },
  );
});
