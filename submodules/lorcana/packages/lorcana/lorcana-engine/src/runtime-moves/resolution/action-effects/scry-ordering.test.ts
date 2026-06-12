import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "../../../testing";
import {
  chiefTuiRespectedLeader,
  heiheiBoatSnack,
  liloMakingAWish,
  moanaOfMotunui,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
  tinkerBellPeterPansAlly,
} from "../../../../../lorcana-cards/src/cards/001";
import { reflection } from "../../../../../lorcana-cards/src/cards/001/actions/065-reflection";
import { soMuchToGive } from "../../../../../lorcana-cards/src/cards/007/actions/038-so-much-to-give";
import { waterHasMemory } from "../../../../../lorcana-cards/src/cards/007/actions/177-water-has-memory";
import { allIsFound } from "../../../../../lorcana-cards/src/cards/007/actions/178-all-is-found";
import { doubleTrouble } from "../../../../../lorcana-cards/src/cards/007/actions/202-double-trouble";
import { showMeMore } from "../../../../../lorcana-cards/src/cards/007/actions/082-show-me-more";

describe("scry ordering", () => {
  it("preserves the selected top-card order while keeping untouched cards in place", () => {
    // Deck (index 0 = bottom, last = top):
    //   [liloMakingAWish, moanaOfMotunui, chiefTuiRespectedLeader, heiheiBoatSnack, mickeyMouseTrueFriend]
    // Scry 3 looks at the top 3: [chiefTuiRespectedLeader, heiheiBoatSnack, mickeyMouseTrueFriend]
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [reflection],
        inkwell: reflection.cost,
        deck: [
          liloMakingAWish,
          moanaOfMotunui,
          chiefTuiRespectedLeader,
          heiheiBoatSnack,
          mickeyMouseTrueFriend,
        ],
      },
      {
        deck: [simbaProtectiveCub, tinkerBellPeterPansAlly],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithDestinations(reflection, {
        zone: "deck-top",
        cards: [mickeyMouseTrueFriend, chiefTuiRespectedLeader, heiheiBoatSnack],
      }),
    ).toBeSuccessfulCommand();

    // Bottom 2 untouched, then reordered top 3
    expect(testEngine.getCardDefinitionIdsInZone("deck", "player_one")).toEqual([
      liloMakingAWish.id,
      moanaOfMotunui.id,
      mickeyMouseTrueFriend.id,
      chiefTuiRespectedLeader.id,
      heiheiBoatSnack.id,
    ]);
  });

  it("keeps the chosen player's untouched card ahead of the reordered looked-at cards", () => {
    // P2 Deck (index 0 = bottom, last = top):
    //   [doubleTrouble, allIsFound, showMeMore, soMuchToGive, tinkerBellPeterPansAlly]
    // Scry 4 looks at top 4: [allIsFound, showMeMore, soMuchToGive, tinkerBellPeterPansAlly]
    // doubleTrouble (bottom) is untouched.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [waterHasMemory],
        inkwell: waterHasMemory.cost,
        deck: [mickeyMouseTrueFriend, simbaProtectiveCub],
      },
      {
        deck: [doubleTrouble, allIsFound, showMeMore, soMuchToGive, tinkerBellPeterPansAlly],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardForPlayer(waterHasMemory, PLAYER_TWO),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [tinkerBellPeterPansAlly] },
          { zone: "deck-bottom", cards: [allIsFound, showMeMore, soMuchToGive] },
        ],
      }),
    ).toBeSuccessfulCommand();

    // doubleTrouble untouched at bottom, then bottom-placed cards, then top-placed card
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO)).toEqual([
      soMuchToGive.id,
      showMeMore.id,
      allIsFound.id,
      doubleTrouble.id,
      tinkerBellPeterPansAlly.id,
    ]);
  });
});
