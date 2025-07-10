/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  baymaxArmoredCompanion,
  hiroHamadaTeamLeader,
} from "@lorcanito/lorcana-engine/cards/006/characters/characters";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("Baymax - Armored Companion", () => {
  it("**THE TREATMENT IS WORKING** When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.", async () => {
    const testEngine = new TestEngine({
      play: [baymaxArmoredCompanion, hiroHamadaTeamLeader],
    });

    const targetCard = await testEngine.setCardDamage(hiroHamadaTeamLeader, 4);

    expect(testEngine.getPlayerLore()).toBe(0);

    await testEngine.questCard(baymaxArmoredCompanion);

    await testEngine.resolveOptionalAbility();
    await testEngine.resolveTopOfStack({
      targets: [targetCard],
    });

    expect(targetCard.damage).toBe(2);

    expect(testEngine.getPlayerLore("player_two")).toBe(0);
    expect(testEngine.getPlayerLore("player_one")).toBe(4);
  });
});
