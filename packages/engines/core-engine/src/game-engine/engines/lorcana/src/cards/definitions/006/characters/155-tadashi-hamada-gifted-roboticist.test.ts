import { describe, it } from "bun:test";
import { tadashiHamadaGiftedRoboticist } from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tadashi Hamada - Gifted Roboticist", () => {
  it.skip("SOMEONE HAS TO HELP During an opponent’s turn, when this character is banished, you may put the top card of your deck into your inkwell facedown. Then, put this card into your inkwell facedown.", async () => {
    const testEngine = new TestEngine({
      inkwell: tadashiHamadaGiftedRoboticist.cost,
      play: [tadashiHamadaGiftedRoboticist],
      hand: [tadashiHamadaGiftedRoboticist],
    });

    await testEngine.playCard(tadashiHamadaGiftedRoboticist);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
