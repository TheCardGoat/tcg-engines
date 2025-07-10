import { describe, expect, it } from "@jest/globals";
import {
  mauiHeroToAll,
  minniMouseAlwaysClassy,
  olafFriendlySnowman,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  friendsOnTheOtherSide,
  suddenChill,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { ursulaDeceiverOfAll } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { theMusesProclaimersOfHeroes } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestEngine } from "../testEngine";

describe("Choose Layer Order", () => {
  it("Resolve Ursula first, then Muses twice.", async () => {
    const testEngine = new TestEngine(
      {
        play: [ursulaDeceiverOfAll, theMusesProclaimersOfHeroes],
        hand: [suddenChill],
      },
      {
        play: [olafFriendlySnowman, minniMouseAlwaysClassy],
        hand: [friendsOnTheOtherSide, mauiHeroToAll],
      },
    );

    await testEngine.singSong({
      song: suddenChill,
      singer: ursulaDeceiverOfAll,
    });

    testEngine.changeActivePlayer("player_two");

    printLayers(testEngine);

    await testEngine.resolveTopOfStack(
      {
        targets: [friendsOnTheOtherSide],
      },
      true,
    );

    testEngine.changeActivePlayer("player_one");

    printLayers(testEngine);

    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.store.stackLayerStore.layers[0]?.id,
      },
      true,
    );

    testEngine.changeActivePlayer("player_two");

    printLayers(testEngine);

    await testEngine.resolveTopOfStack(
      {
        targets: [mauiHeroToAll],
      },
      true,
    );

    testEngine.changeActivePlayer("player_one");

    printLayers(testEngine);

    // Strange behavior because you have to accept optional abilities first before you can resolve them
    // This creates a new layer (which is now placed on the bottom of the stack) so we're first accepting the top Muses ability
    // then resolving the newly added Muses ability (which has optional accepted)
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.store.stackLayerStore.layers[1]?.id,
        targets: [olafFriendlySnowman],
      },
      true,
    );

    printLayers(testEngine);

    // Same thing as above happens here for this muses trigger
    // TODO: change how we handle optional abilities so it either doesn't create a new layer or returns the new layer id
    // so we can immediately resolve it
    await testEngine.resolveOptionalAbility();
    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.store.stackLayerStore.layers[0]?.id,
        targets: [minniMouseAlwaysClassy],
      },
      true,
    );

    printLayers(testEngine);
  });
});

function printLayers(testEngine: TestEngine) {
  const layers = testEngine.store.stackLayerStore.layers;
  console.log(`Stack (${layers.length} layers) first to last:`);

  // Print in reverse order since stack grows from bottom to top
  for (let i = layers.length - 1; i >= 0; i--) {
    const layer = layers[i];
    console.log(
      `[${i}] ${layer?.source.lorcanitoCard.name} - ${layer?.ability.name}`,
    );
  }
}
