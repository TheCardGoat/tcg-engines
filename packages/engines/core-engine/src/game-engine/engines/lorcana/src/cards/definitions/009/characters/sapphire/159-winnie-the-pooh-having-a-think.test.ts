/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { winnieThePoohHavingAThink } from "~/game-engine/engines/lorcana/src/cards/definitions/009/index";

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
