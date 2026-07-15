import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { simbaProtectiveCub } from "../../001";
import { duckburgFunsosFunzone } from "../locations/034-duckburg-funsos-funzone";
import { fairyGodmothersWand } from "../items/168-fairy-godmothers-wand";
import { henWensVisions } from "./161-hen-wens-visions";

describe("Hen Wen's Visions", () => {
  it("keeps one looked-at card on top and puts the rest on the bottom in the chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [henWensVisions],
      inkwell: henWensVisions.cost,
      deck: [duckburgFunsosFunzone, goofyKnightForADay, fairyGodmothersWand, simbaProtectiveCub],
    });

    const playResult = testEngine.asPlayerOne().playCardWithDestinations(
      henWensVisions,
      {
        zone: "deck-top",
        cards: [goofyKnightForADay],
      },
      {
        zone: "deck-bottom",
        cards: [simbaProtectiveCub, fairyGodmothersWand, duckburgFunsosFunzone],
      },
    );

    expect(playResult).toBeSuccessfulCommand();
    const deckIds = testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE);

    expect(deckIds.slice(0, 4)).toEqual([
      duckburgFunsosFunzone.id,
      fairyGodmothersWand.id,
      simbaProtectiveCub.id,
      goofyKnightForADay.id,
    ]);
  });
});
