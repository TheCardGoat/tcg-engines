import { describe, expect, it } from "bun:test";
import {
  donaldDuck,
  mickeyBraveLittleTailor,
  minnieMouseBelovedPrincess,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";

// Use local simple stand-ins instead of missing character imports
const aladdinCorneredSwordman = { id: "aladdinCorneredSwordman" } as any;
const abuBoldHelmsman = { id: "abuBoldHelmsman" } as any;
const genieOnTheJob = { id: "genieOnTheJob" } as any;
const goofyDaredevil = { id: "goofyDaredevil" } as any;
const jafarWicked = { id: "jafarWicked" } as any;

import { LorcanaTestEngine } from "./lorcana-test-engine";

describe("Lorcana Engine", () => {
  it("Should properly initialize the engine's board state", () => {
    const testEngine = new LorcanaTestEngine(
      {
        deck: 10,
        hand: [mickeyBraveLittleTailor],
        discard: [donaldDuck],
        play: [goofyDaredevil],
        inkwell: [minnieMouseBelovedPrincess],
        lore: 1,
      },
      {
        deck: 20,
        hand: [aladdinCorneredSwordman],
        discard: [abuBoldHelmsman],
        play: [jafarWicked],
        inkwell: [genieOnTheJob],
        lore: 2,
      },
    );

    expect(testEngine.getPlayerLore("player_one")).toEqual(1);

    testEngine.assertThatZonesContain(
      {
        deck: 10,
        hand: 1,
        discard: 1,
        play: 1,
        inkwell: 1,
      },
      "player_one",
    );

    const mickey = testEngine.getCardModel(mickeyBraveLittleTailor);

    expect(mickey.card).toEqual(mickeyBraveLittleTailor);
    expect(mickey.owner).toEqual("player_one");
    expect(mickey.zone).toEqual("hand");

    const donald = testEngine.getCardModel(donaldDuck);
    expect(donald.card).toEqual(donaldDuck);
    expect(donald.owner).toEqual("player_one");
    expect(donald.zone).toEqual("discard");

    const goofy = testEngine.getCardModel(goofyDaredevil);
    expect(goofy.card).toEqual(goofyDaredevil);
    expect(goofy.owner).toEqual("player_one");
    expect(goofy.zone).toEqual("play");

    const minnie = testEngine.getCardModel(minnieMouseBelovedPrincess);
    expect(minnie.card).toEqual(minnieMouseBelovedPrincess);
    expect(minnie.owner).toEqual("player_one");
    expect(minnie.zone).toEqual("inkwell");

    expect(testEngine.getPlayerLore("player_two")).toEqual(2);

    testEngine.assertThatZonesContain(
      {
        deck: 20,
        hand: 1,
        discard: 1,
        play: 1,
        inkwell: 1,
      },
      "player_two",
    );

    const aladdin = testEngine.getCardModel(aladdinCorneredSwordman);
    expect(aladdin.card).toEqual(aladdinCorneredSwordman);
    expect(aladdin.owner).toEqual("player_two");
    expect(aladdin.zone).toEqual("hand");

    const abu = testEngine.getCardModel(abuBoldHelmsman);
    expect(abu.card).toEqual(abuBoldHelmsman);
    expect(abu.owner).toEqual("player_two");
    expect(abu.zone).toEqual("discard");

    const jafar = testEngine.getCardModel(jafarWicked);
    expect(jafar.card).toEqual(jafarWicked);
    expect(jafar.owner).toEqual("player_two");
    expect(jafar.zone).toEqual("play");

    const genie = testEngine.getCardModel(genieOnTheJob);
    expect(genie.card).toEqual(genieOnTheJob);
    expect(genie.owner).toEqual("player_two");
    expect(genie.zone).toEqual("inkwell");
  });

  it("Should start game properly", () => {
    const testEngine = new LorcanaTestEngine({}, {}, { skipPreGame: false });

    testEngine.assertThatZonesContain(
      {
        deck: 10,
        hand: 0,
        discard: 0,
        play: 0,
        inkwell: 0,
      },
      "player_one",
    );

    testEngine.assertThatZonesContain(
      {
        deck: 10,
        hand: 0,
        discard: 0,
        play: 0,
        inkwell: 0,
      },
      "player_two",
    );

    expect(testEngine.getPlayerLore("player_one")).toEqual(0);
    expect(testEngine.getPlayerLore("player_two")).toEqual(0);
    expect(testEngine.getNumTurns()).toEqual(1);
    expect(testEngine.getNumMoves()).toEqual(0);
    expect(testEngine.getGameSegment()).toEqual("startingAGame");
    // expect(testEngine.getPriorityPlayers()).toEqual(undefined);
    // expect(testEngine.getTurnPlayer()).toEqual("NOT_IMPLEMENTED");

    // console.log(
    //   testEngine.playerOneEngine.getUnsafeClient().moves.chooseFirstPlayer(),
    // );
  });
});
