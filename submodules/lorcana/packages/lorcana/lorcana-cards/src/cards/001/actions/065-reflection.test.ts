import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import {
  chiefTuiRespectedLeader,
  heiheiBoatSnack,
  liloMakingAWish,
  moanaOfMotunui,
} from "../characters";
import { reflection } from "./065-reflection";

describe("Reflection", () => {
  it("looks at top 3 cards and puts them back on top in chosen order", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [reflection],
      inkwell: reflection.cost,
      deck: [liloMakingAWish, moanaOfMotunui, chiefTuiRespectedLeader, heiheiBoatSnack],
    });

    const playResult = testEngine.asPlayerOne().playCardWithDestinations(reflection, {
      zone: "deck-top",
      cards: [chiefTuiRespectedLeader, heiheiBoatSnack, moanaOfMotunui],
    });

    expect(playResult).toBeSuccessfulCommand();

    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([
      liloMakingAWish.id,
      chiefTuiRespectedLeader.id,
      heiheiBoatSnack.id,
      moanaOfMotunui.id,
    ]);
  });
});
