/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  chiefBogoRespectedOfficer,
  panicUnderworldImp,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { jimHawkinsRiggerSpecialist } from "@lorcanito/lorcana-engine/cards/006";
import {
  moanaAdventurerOfLandAndSea,
  theReturnOfHercules,
} from "@lorcanito/lorcana-engine/cards/007";
import { honeyLemonCostumedCatalyst } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("The Return Of Hercules", () => {
  it("Each player may reveal a character card from their hand and play it for free", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: theReturnOfHercules.cost,
        hand: [theReturnOfHercules, moanaAdventurerOfLandAndSea],
      },
      {
        hand: [mickeyMouseTrueFriend],
      },
    );

    await testEngine.playCard(theReturnOfHercules);

    // Player 1 reveals and plays their character
    await testEngine.acceptOptionalAbility();
    await testEngine.resolveTopOfStack(
      {
        targets: [moanaAdventurerOfLandAndSea],
      },
      true,
    );
    expect(testEngine.getCardModel(moanaAdventurerOfLandAndSea).zone).toBe(
      "play",
    );

    // // Player 2 reveals and plays their character
    testEngine.changeActivePlayer("player_two");
    expect(testEngine.store.priorityPlayer).toEqual("player_two");
    await testEngine.acceptOptionalAbility();
    await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
    expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("play");
  });

  it("Return of Hercules + When you play this character effects", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: theReturnOfHercules.cost,
        hand: [theReturnOfHercules, jimHawkinsRiggerSpecialist],
        play: [chiefBogoRespectedOfficer],
      },
      {
        hand: [panicUnderworldImp],
        play: [honeyLemonCostumedCatalyst],
      },
    );

    await testEngine.playCard(theReturnOfHercules);

    // Player 1 accepts the optional ability to play a character
    testEngine.changeActivePlayer("player_one");
    expect(testEngine.store.priorityPlayer).toEqual("player_one");
    await testEngine.acceptOptionalLayer(
      false,
      testEngine.getLayerIdForPlayer("player_one"),
    );
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.getLayerIdForPlayer("player_one"),
        targets: [jimHawkinsRiggerSpecialist],
      },
      true,
    );

    expect(testEngine.getCardModel(jimHawkinsRiggerSpecialist).zone).toBe(
      "play",
    );

    // Player 2 accepts the optional ability to play a character
    testEngine.changeActivePlayer("player_two");
    expect(testEngine.store.priorityPlayer).toEqual("player_two");
    await testEngine.acceptOptionalLayer(
      false,
      testEngine.getLayerIdForPlayer("player_two"),
    );
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.getLayerIdForPlayer("player_two"),
        targets: [panicUnderworldImp],
      },
      true,
    );
    expect(testEngine.getCardModel(panicUnderworldImp).zone).toBe("play");

    // Chief Bogo Ability triggers, causing 1 damage to each character
    expect(testEngine.getCardModel(honeyLemonCostumedCatalyst).damage).toBe(1);
    // TODO: Chief Bogo's ability should deal 1 damage to Panic Underworld Imp, but the effect is not going to the back and it's getting auto resolved
    // I know how to fix this, but I will roll out later so I can identify the issues caused by this change
    // expect(testEngine.getCardModel(panicUnderworldImp).damage).toBe(1);

    // Player 1's character has a "When you play this character" effect
    testEngine.changeActivePlayer("player_one");
    expect(testEngine.store.priorityPlayer).toEqual("player_one");
    await testEngine.acceptOptionalLayer(
      false,
      testEngine.getLayerIdForPlayer("player_one"),
    );
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.getLayerIdForPlayer("player_one"),
        targets: [chiefBogoRespectedOfficer],
      },
      true,
    );

    // Jim Hawkins' ability should trigger and deal 1 damage to Chief Bogo
    expect(testEngine.getCardModel(chiefBogoRespectedOfficer).damage).toBe(1);

    // Now player one uses Panic Underworld Imp's ability
    testEngine.changeActivePlayer("player_two");
    expect(testEngine.store.priorityPlayer).toEqual("player_two");
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.getLayerIdForPlayer("player_two"),
        targets: [honeyLemonCostumedCatalyst],
      },
      true,
    );

    expect(testEngine.getCardModel(honeyLemonCostumedCatalyst).strength).toBe(
      honeyLemonCostumedCatalyst.strength + 2,
    );

    testEngine.changeActivePlayer("player_one");
    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
