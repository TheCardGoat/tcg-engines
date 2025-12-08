import { describe, expect, it } from "bun:test";
import { beastGraciousPrince } from "~/game-engine/engines/lorcana/src/cards/definitions/009/characters/amber/004-beast-gracious-prince";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { stitchRockStar } from "../amber/003-stitch-rock-star";
import { liloBestExplorerEver } from "./174-lilo-best-explorer-ever";

describe("Lilo - Best Explorer Ever", () => {
  it("COME ON, PEOPLE, LET'S MOVE When you play this character, your other characters gain Challenger +2 this turn. (They get +2 {S} while challenging.)", async () => {
    const testEngine = new TestEngine({
      inkwell: liloBestExplorerEver.cost,
      hand: [liloBestExplorerEver],
      play: [beastGraciousPrince],
    });

    expect(testEngine.getCardModel(beastGraciousPrince).hasChallenger).toBe(
      false,
    );
    await testEngine.playCard(liloBestExplorerEver);
    expect(testEngine.getCardModel(beastGraciousPrince).hasChallenger).toBe(
      true,
    );
  });

  it("GO GET 'EM Whenever this character quests, chosen Alien character gains Challenger +2 and 'This character can challenge ready characters' this turn.", async () => {
    const testEngine = new TestEngine({
      play: [liloBestExplorerEver, stitchRockStar],
    });

    await testEngine.questCard(liloBestExplorerEver);

    expect(testEngine.getCardModel(stitchRockStar).hasChallenger).toBe(false);
    await testEngine.resolveTopOfStack({ targets: [stitchRockStar] });
    expect(testEngine.getCardModel(stitchRockStar).hasChallenger).toBe(true);
    expect(
      testEngine.getCardModel(stitchRockStar).canChallengeReadyCharacters,
    ).toBe(true);
  });
});
