import { lookWhatYouveDone, youBrokeMySmolder } from "@tcg/lorcana-cards/cards/013";
import { chiefTuiRespectedLeader } from "@tcg/lorcana-cards/cards/001";
import { createFixture } from "../../fixture-factory.js";

export const lookWhatYouveDoneSingleReplayRegression = createFixture({
  id: "look-what-youve-done-single-replay",
  name: "Look What You've Done - Single Discard Replay",
  description:
    "Player report visual validation. Play You Broke My Smolder to discard Look What You've Done, then play Look What You've Done from discard and choose Chief Tui. Expected: Chief Tui takes 2 damage, Look What You've Done returns to discard, and it is no longer playable from discard even though 2 ink remains.",
  playerOne: {
    hand: [youBrokeMySmolder, lookWhatYouveDone],
    inkwell: 5,
    deck: 2,
    lore: 0,
  },
  playerTwo: {
    play: [chiefTuiRespectedLeader],
    deck: 2,
    lore: 0,
  },
  seed: "look-what-youve-done-single-replay",
  skipPreGame: true,
});
