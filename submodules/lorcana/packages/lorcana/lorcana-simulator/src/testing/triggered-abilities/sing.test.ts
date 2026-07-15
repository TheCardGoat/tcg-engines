import { describe, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { powerlineWorldsGreatestRockStar } from "@tcg/lorcana-cards/cards/009";

describe("I'LL GET THERE - Powerline, World's Greatest Rock Star - Once during your turn, whenever this character sings a song, look at the top 4 cards of your deck. You may reveal a song card with cost 9 or less and play it for free.", () => {
  // Test cases to cover:
  // 1. Triggers when this character exerts to sing (pay for) a song
  // 2. Does NOT trigger when a different character sings the song
  // 3. Does NOT trigger when this character plays a song by paying its ink cost (not singing)
  // 4. Once-per-turn restriction respected — second sing in the same turn does not trigger again
  // 5. Song played for free via trigger does not itself trigger this ability again (no loop)
  // 6. If no song with cost ≤9 in top 4 cards, effect is skipped gracefully
  // 7. Cards not selected are placed on the bottom of the deck in chosen order
  // 8. once-per-song restriction: only one trigger even if multiple characters sing together

  it.todo("It should trigger when this character sings a song", () => {});
});
