import { describe, expect, it } from "bun:test";
import { fallingDownTheRabbitHole } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import {
  herculesHeroInTraining,
  pachaVillageLeader,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Falling Down the Rabbit Hole", () => {
  it("Each player chooses one of their characters and puts them into their inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: fallingDownTheRabbitHole.cost,
        hand: [fallingDownTheRabbitHole],
        play: [pachaVillageLeader],
      },
      {
        play: [herculesHeroInTraining],
      },
    );

    const cardUnderTest = testEngine.getByZoneAndId(
      "hand",
      fallingDownTheRabbitHole.id,
    );
    const target = testEngine.getByZoneAndId("play", pachaVillageLeader.id);
    const opponentTarget = testEngine.getByZoneAndId(
      "play",
      herculesHeroInTraining.id,
      "player_two",
    );

    await testEngine.playCard(cardUnderTest);

    testEngine.changeActivePlayer("player_one");
    expect(testEngine.store.priorityPlayer).toEqual("player_one");

    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.getLayerIdForPlayer("player_one"),
        targets: [target],
      },
      true,
    );
    expect(target.zone).toEqual("inkwell");
    expect(target.ready).toEqual(false);

    testEngine.changeActivePlayer("player_two");
    expect(testEngine.store.priorityPlayer).toEqual("player_two");

    await testEngine.resolveStackLayer(
      {
        layerId: testEngine.getLayerIdForPlayer("player_two"),
        targets: [opponentTarget],
      },
      true,
    );

    expect(opponentTarget.zone).toEqual("inkwell");
    expect(opponentTarget.ready).toEqual(false);

    expect(testEngine.stackLayers).toHaveLength(0);
  });
});
