import { expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "../../testing/index.ts";
import { dorinthea } from "../../../../cards/src/cards/heroes/dorinthea.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { shiftTheTideOfBattleYellow } from "../../../../cards/src/cards/attack-reactions/shift-the-tide-of-battle.ts";

// Public rejection-message contract: an authored target without descriptive text
// still gives the player a complete explanation, never empty quotation marks.
it("explains an unavailable target when its instruction has no display text", () => {
  const game = FabTestEngine.start(
    { hero: dorinthea, hand: [snatchRed, shiftTheTideOfBattleYellow], actionPoints: 1, deck: 6 },
    { hero: dash, hand: [], deck: 6 },
    FAB_MANUAL_HARNESS,
  );
  const player = game.as(dorinthea);
  player.must.playAttack(snatchRed);
  game.toReaction("attacker");
  expect(() => player.must.playReaction(shiftTheTideOfBattleYellow)).toThrow(
    "couldn't be played because it had no legal target. Check the card's target requirements.",
  );
});
