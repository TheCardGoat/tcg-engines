/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { dragonFire } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  moanChosenByTheOcean,
  tamatoaSoShiny,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import {
  luckyDime,
  mauisFishHook,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import { mauisPlaceOfExileHiddenIsland } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/indext";
import { hiddenCoveTranquilHaven } from "~/game-engine/engines/lorcana/src/cards/definitions/004/locations";
import { perilousMazeWateryLabyrinth } from "~/game-engine/engines/lorcana/src/cards/definitions/006";
import {
  heiheiExpandedConsciousness,
  teKaElementalTerror,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import { mauiStubbornTrickster } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Maui - Stubborn Trickster", () => {
  it("I'M NOT FINISHED YET When this character is banished, choose one:", async () => {
    const testEngine = new TestEngine({
      inkwell: mauiStubbornTrickster.cost,
      play: [mauiStubbornTrickster],
      hand: [dragonFire],
    });

    await testEngine.playCard(mauiStubbornTrickster);
    await testEngine.playCard(
      dragonFire,
      {
        targets: [mauiStubbornTrickster],
      },
      true,
    );

    expect(testEngine.stackLayers).toHaveLength(1);
  });

  it("- Put 2 damage counters on all opposing characters.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mauiStubbornTrickster.cost,
        play: [mauiStubbornTrickster, moanChosenByTheOcean],
        hand: [dragonFire],
      },
      {
        play: [teKaElementalTerror, tamatoaSoShiny],
      },
    );

    await testEngine.playCard(
      dragonFire,
      {
        targets: [mauiStubbornTrickster],
      },
      true,
    );

    await testEngine.resolveTopOfStack({ mode: "1" });

    expect(testEngine.getCardModel(teKaElementalTerror).damage).toEqual(2);
    expect(testEngine.getCardModel(tamatoaSoShiny).damage).toEqual(2);
    expect(testEngine.getCardModel(moanChosenByTheOcean).damage).toEqual(0);
  });

  it("- Put 2 damage counters on all opposing characters. RESIST", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mauiStubbornTrickster.cost,
        play: [mauiStubbornTrickster],
        hand: [dragonFire],
      },
      {
        play: [heiheiExpandedConsciousness],
      },
    );

    await testEngine.playCard(
      dragonFire,
      {
        targets: [mauiStubbornTrickster],
      },
      true,
    );

    await testEngine.resolveTopOfStack({ mode: "1" });

    expect(
      testEngine.getCardModel(heiheiExpandedConsciousness).hasResist,
    ).toBeTruthy();
    expect(testEngine.getCardModel(heiheiExpandedConsciousness).damage).toEqual(
      2,
    );
  });

  it("- Banish all opposing items.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mauiStubbornTrickster.cost,
        play: [mauiStubbornTrickster, mauisFishHook],
        hand: [dragonFire],
      },
      {
        play: [luckyDime, pawpsicle],
      },
    );

    await testEngine.playCard(mauiStubbornTrickster);
    await testEngine.playCard(
      dragonFire,
      {
        targets: [mauiStubbornTrickster],
      },
      true,
    );

    await testEngine.resolveTopOfStack({ mode: "2" });

    expect(testEngine.getCardModel(luckyDime).zone).toEqual("discard");
    expect(testEngine.getCardModel(pawpsicle).zone).toEqual("discard");
    expect(testEngine.getCardModel(mauisFishHook).zone).toEqual("play");
  });

  it("- Banish all opposing locations.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: mauiStubbornTrickster.cost,
        play: [mauiStubbornTrickster, mauisPlaceOfExileHiddenIsland],
        hand: [dragonFire],
      },
      {
        play: [hiddenCoveTranquilHaven, perilousMazeWateryLabyrinth],
      },
    );

    await testEngine.playCard(mauiStubbornTrickster);
    await testEngine.playCard(
      dragonFire,
      {
        targets: [mauiStubbornTrickster],
      },
      true,
    );

    await testEngine.resolveTopOfStack({ mode: "3" });

    expect(testEngine.getCardModel(hiddenCoveTranquilHaven).zone).toEqual(
      "discard",
    );
    expect(testEngine.getCardModel(perilousMazeWateryLabyrinth).zone).toEqual(
      "discard",
    );
    expect(testEngine.getCardModel(mauisPlaceOfExileHiddenIsland).zone).toEqual(
      "play",
    );
  });
});
