import { describe, it } from "bun:test";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { winnieThePoohHavingAThink } from "./159-winnie-the-pooh-having-a-think";

describe("Winnie the Pooh - Having a Think", () => {
  it.skip("**HUNNY POT** Whenever this character quests, you may put a card from your hand into your inkwell facedown.", async () => {
    const testEngine = new TestEngine({
      inkwell: winnieThePoohHavingAThink.cost,
      play: [winnieThePoohHavingAThink],
      hand: [winnieThePoohHavingAThink],
    });

    await testEngine.playCard(winnieThePoohHavingAThink);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({});
  });
});
