import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { duckburgFunsosFunzone } from "../../010/locations/034-duckburg-funsos-funzone";
import { fairyGodmothersWand } from "../../010/items/168-fairy-godmothers-wand";
import { downInNewOrleans } from "./177-down-in-new-orleans";
import { lightTheFuse } from "./149-light-the-fuse";
import { wrongLever } from "./116-wrong-lever";
import { desperatePlan } from "./201-desperate-plan";
import { kuzcoImpulsiveLlama } from "../characters/067-kuzco-impulsive-llama";

describe("Down in New Orleans", () => {
  it("plays one eligible card for free and puts the rest on the bottom in the chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [downInNewOrleans],
      inkwell: downInNewOrleans.cost,
      deck: [goofyKnightForADay, fairyGodmothersWand, duckburgFunsosFunzone],
    });

    expect(
      testEngine
        .asPlayerOne()
        .playCardWithDestinations(
          downInNewOrleans,
          { zone: "play", cards: duckburgFunsosFunzone },
          { zone: "deck-bottom", cards: [fairyGodmothersWand, goofyKnightForADay] },
        ).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(duckburgFunsosFunzone)).toBe("play");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      goofyKnightForADay.id,
      fairyGodmothersWand.id,
    ]);
  });

  it("keeps all looked-at cards on the bottom when none can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [downInNewOrleans],
      inkwell: downInNewOrleans.cost,
      deck: [lightTheFuse, wrongLever, desperatePlan],
    });

    expect(
      testEngine.asPlayerOne().playCardWithDestinations(downInNewOrleans, {
        zone: "deck-bottom",
        cards: [desperatePlan, wrongLever, lightTheFuse],
      }).success,
    ).toBe(true);

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      lightTheFuse.id,
      wrongLever.id,
      desperatePlan.id,
    ]);
  });

  it("rejects placing a cost-7 character into the play destination (cost filter enforced)", () => {
    // kuzcoImpulsiveLlama costs 7 — exceeds the cost 6 threshold
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [downInNewOrleans],
      inkwell: downInNewOrleans.cost,
      deck: [kuzcoImpulsiveLlama, fairyGodmothersWand, duckburgFunsosFunzone],
    });

    // Attempt to illegally play a cost-7 character for free
    testEngine
      .asPlayerOne()
      .playCardWithDestinations(
        downInNewOrleans,
        { zone: "play", cards: kuzcoImpulsiveLlama },
        { zone: "deck-bottom", cards: [fairyGodmothersWand, duckburgFunsosFunzone] },
      );

    // The command was rejected (server-side); kuzco must still be in the deck (not in play)
    expect(testEngine.asPlayerOne().getCardZone(kuzcoImpulsiveLlama)).not.toBe("play");
  });

  it("projects play destination metadata for the pending scry selection", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [downInNewOrleans],
      inkwell: downInNewOrleans.cost,
      deck: [goofyKnightForADay, fairyGodmothersWand, duckburgFunsosFunzone],
    });

    expect(testEngine.asPlayerOne().playCard(downInNewOrleans)).toBeSuccessfulCommand();

    const pendingEffect = testEngine.asServer().getState().G.pendingEffects[0];
    expect(pendingEffect?.selectionContext).toMatchObject({
      kind: "scry-selection",
      destinationRules: [
        {
          zone: "play",
          max: 1,
          reveal: true,
          cost: "free",
          filters: [
            {
              type: "and",
              filters: [{ type: "or" }, { type: "cost-comparison" }],
            },
          ],
        },
        {
          zone: "deck-bottom",
          remainder: true,
          ordering: "player-choice",
        },
      ],
    });
  });
});
