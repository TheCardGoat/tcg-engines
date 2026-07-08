import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { narrowEscape } from "./069-narrow-escape";
import { redMoonRitual } from "./134-red-moon-ritual";
import { youveGotSomePunch } from "./064-youve-got-some-punch";
import { petrify } from "./066-petrify";
import { toWitherAFlower } from "./101-to-wither-a-flower";
import { redAlert } from "./135-red-alert";
import { itsGonnaBeGreat } from "./138-its-gonna-be-great";
import { focusedSearch } from "./167-focused-search";
import { weveGotALotToDo } from "./168-weve-got-a-lot-to-do";
import { cowerBeforeMe } from "./198-cower-before-me";
import { wellSaveOurVillage } from "./199-well-save-our-village";
import { attackOfTheVine } from "./202-attack-of-the-vine";

const opposingCharacter = createMockCharacter({
  id: "set13-action-opposing-character",
  name: "Opposing Character",
  cost: 2,
});

const damagedOpposingCharacter = createMockCharacter({
  id: "set13-action-damaged-opposing-character",
  name: "Damaged Opposing Character",
  cost: 2,
  willpower: 5,
});

const undamagedOpposingCharacter = createMockCharacter({
  id: "set13-action-undamaged-opposing-character",
  name: "Undamaged Opposing Character",
  cost: 2,
  willpower: 5,
});

const damagedFriendlyCharacter = createMockCharacter({
  id: "set13-action-damaged-friendly-character",
  name: "Damaged Friendly Character",
  cost: 2,
  willpower: 5,
});

const friendlyCharacter = createMockCharacter({
  id: "set13-action-friendly-character",
  name: "Friendly Character",
  cost: 2,
});

const friendlyMonster = createMockCharacter({
  id: "set13-action-friendly-monster",
  name: "Friendly Monster",
  cost: 2,
  classifications: ["Storyborn", "Monster"],
});

const lowStrengthOpposingCharacter = createMockCharacter({
  id: "set13-action-low-strength-opposing-character",
  name: "Low Strength Opposing Character",
  cost: 3,
  strength: 3,
  willpower: 4,
});

const secondOpposingCharacter = createMockCharacter({
  id: "set13-action-second-opposing-character",
  name: "Second Opposing Character",
  cost: 2,
});

const targetItem = createMockItem({
  id: "set13-action-target-item",
  name: "Target Item",
  cost: 2,
});

const searchItem = createMockItem({
  id: "set13-action-search-item",
  name: "Search Item",
  cost: 2,
});

const searchAction = createMockAction({
  id: "set13-action-search-action",
  name: "Search Action",
  cost: 1,
});

const kevinCharacter = createMockCharacter({
  id: "set13-action-kevin-character",
  name: "Kevin",
  cost: 2,
});

const friendlyLocation = createMockLocation({
  id: "set13-action-friendly-location",
  name: "Friendly Location",
  cost: 2,
  willpower: 5,
  moveCost: 1,
  lore: 1,
});

const floodbornCharacter = createMockCharacter({
  id: "set13-action-floodborn-character",
  name: "Floodborn Character",
  cost: 3,
  classifications: ["Floodborn", "Hero"],
});

describe("Set 13 action happy paths", () => {
  it("You've Got Some Punch gives chosen character Rush and Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [youveGotSomePunch],
      inkwell: youveGotSomePunch.cost,
      play: [friendlyCharacter],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(youveGotSomePunch, friendlyCharacter),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(friendlyCharacter, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(friendlyCharacter, "Challenger")).toBe(2);
  });

  it("Petrify exerts chosen opposing character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [petrify],
        inkwell: petrify.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(petrify, { targets: [opposingCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().isExerted(opposingCharacter)).toBe(true);
  });

  it("To Wither a Flower deals 2 damage to each opposing damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [toWitherAFlower],
        inkwell: toWitherAFlower.cost,
        play: [{ card: damagedFriendlyCharacter, damage: 1 }],
      },
      {
        play: [{ card: damagedOpposingCharacter, damage: 1 }, undamagedOpposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().playCard(toWitherAFlower)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(damagedOpposingCharacter)).toBe(3);
    expect(testEngine.asPlayerTwo().getDamage(undamagedOpposingCharacter)).toBe(0);
    expect(testEngine.asPlayerOne().getDamage(damagedFriendlyCharacter)).toBe(1);
  });

  it("It's Gonna Be Great readies chosen character and prevents them from questing this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [itsGonnaBeGreat],
      inkwell: itsGonnaBeGreat.cost,
      play: [{ card: friendlyCharacter, exerted: true }],
    });

    expect(
      testEngine.asPlayerOne().playCardTo(itsGonnaBeGreat, friendlyCharacter),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toBeReady(friendlyCharacter);
    expect(testEngine.hasRestriction(friendlyCharacter, "cant-quest")).toBe(true);
  });

  it("Red Alert banishes a low-strength character and makes the opponent lose lore while you have a Monster", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [redAlert],
        inkwell: redAlert.cost,
        play: [friendlyMonster],
      },
      {
        lore: 3,
        play: [lowStrengthOpposingCharacter],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(redAlert, { targets: [lowStrengthOpposingCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(lowStrengthOpposingCharacter)).toBe("discard");
    expect(testEngine.getLore(PLAYER_TWO)).toBe(2);
  });

  it("Narrow Escape returns up to 2 low-cost characters, items, or locations to hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [narrowEscape],
      inkwell: narrowEscape.cost,
      play: [friendlyCharacter, targetItem],
    });

    expect(
      testEngine.asPlayerOne().playCard(narrowEscape, {
        targets: [friendlyCharacter, targetItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(friendlyCharacter)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("hand");
  });

  it("Red Moon Ritual has Sing Together 7 and banishes chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [redMoonRitual],
        inkwell: redMoonRitual.cost,
      },
      {
        play: [opposingCharacter],
      },
    );

    expect(testEngine.asPlayerOne().getKeywordValue(redMoonRitual, "SingTogether")).toBe(7);
    expect(
      testEngine.asPlayerOne().playCard(redMoonRitual, { targets: [opposingCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opposingCharacter)).toBe("discard");
  });

  it("Focused Search reveals a Kevin character or item from the top 4 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [focusedSearch],
      inkwell: focusedSearch.cost,
      deck: [searchAction, kevinCharacter, searchItem, secondOpposingCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(focusedSearch)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "hand", cards: [kevinCharacter] },
          { zone: "deck-bottom", cards: [secondOpposingCharacter, searchItem, searchAction] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(kevinCharacter)).toBe("hand");
  });

  it("We've Got a Lot to Do puts a chosen item into its owner's inkwell exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [weveGotALotToDo],
      inkwell: weveGotALotToDo.cost,
      play: [targetItem],
    });

    expect(
      testEngine.asPlayerOne().playCard(weveGotALotToDo, { targets: [targetItem] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(targetItem)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(targetItem)).toBe(true);
  });

  it("Cower Before Me prevents up to 2 chosen opposing characters from challenging next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [cowerBeforeMe],
        inkwell: cowerBeforeMe.cost,
      },
      {
        play: [opposingCharacter, secondOpposingCharacter],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .playCard(cowerBeforeMe, { targets: [opposingCharacter, secondOpposingCharacter] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(testEngine.hasRestriction(opposingCharacter, "cant-challenge")).toBe(true);
    expect(testEngine.hasRestriction(secondOpposingCharacter, "cant-challenge")).toBe(true);
  });

  it("We'll Save Our Village gives your characters and locations Resist +1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [wellSaveOurVillage],
      inkwell: wellSaveOurVillage.cost,
      play: [friendlyCharacter, friendlyLocation],
    });

    expect(testEngine.asPlayerOne().playCard(wellSaveOurVillage)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(friendlyCharacter, "Resist")).toBe(1);
    expect(testEngine.asPlayerOne().getKeywordValue(friendlyLocation, "Resist")).toBe(1);
  });

  it("Attack of the Vine gives your Floodborn characters Resist +2 and challenge-ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [attackOfTheVine],
      inkwell: attackOfTheVine.cost,
      play: [floodbornCharacter, friendlyCharacter],
    });

    expect(testEngine.asPlayerOne().playCard(attackOfTheVine)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(floodbornCharacter, "Resist")).toBe(2);
    expect(testEngine.hasGrantedAbility(floodbornCharacter, "can-challenge-ready")).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(friendlyCharacter, "Resist")).toBe(null);
    expect(testEngine.hasGrantedAbility(friendlyCharacter, "can-challenge-ready")).toBe(false);
  });
});
