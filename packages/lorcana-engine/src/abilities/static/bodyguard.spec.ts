/**
 * @jest-environment node
 */

/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import {
  bodyguardAbility,
  evasiveAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import {
  heiheiBoatSnack,
  herculesTrueHero,
  ladyTremaine,
  simbaProtectiveCub,
  tinkerBellMostHelpful,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { prideLandsJungleOasis } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  id: "testCard-with-bodyguard-and-evasive",
  abilities: [bodyguardAbility, evasiveAbility],
};

allCardsById[testCard.id] = testCard;

it("Let's you play a bodyguard character exerted", () => {
  const testStore = new TestStore({
    inkwell: simbaProtectiveCub.cost,
    hand: [simbaProtectiveCub],
  });

  const cardUnderTest = testStore.getCard(simbaProtectiveCub);

  cardUnderTest.playFromHand({ bodyguard: true });

  expect(cardUnderTest.meta.exerted).toBe(true);
  expect(cardUnderTest.zone).toBe("play");
});

it("Let's you play a bodyguard character non-exerted", () => {
  const testStore = new TestStore({
    inkwell: simbaProtectiveCub.cost,
    hand: [simbaProtectiveCub],
  });

  const cardUnderTest = testStore.getCard(simbaProtectiveCub);

  cardUnderTest.playFromHand({ bodyguard: false });

  expect(cardUnderTest.meta.exerted).toBeFalsy();
  expect(cardUnderTest.zone).toBe("play");
});

it("doesn't let you challenge a body guarded character", () => {
  const testStore = new TestStore(
    {
      play: [ladyTremaine],
    },
    {
      play: [simbaProtectiveCub, heiheiBoatSnack],
    },
  );

  const cards = testStore.store.tableStore.getPlayerZone(
    "player_two",
    "play",
  )?.cards;
  if (cards) {
    for (const card of cards) {
      card.updateCardMeta({ exerted: true });
    }
  }

  const attacker = testStore.getCard(ladyTremaine);
  const defender = testStore.getCard(heiheiBoatSnack);
  const bodyguard = testStore.getCard(simbaProtectiveCub);

  attacker.challenge(defender);

  // Bodyguard should prevent the challenge from happening, in case of an invalid target
  expect(attacker.meta?.damage).toBeFalsy();
  expect(defender.meta?.damage).toBeFalsy();
  expect(bodyguard.meta?.damage).toBeFalsy();
  expect(
    testStore.store.tableStore.getTable("player_one").turn.challenges,
  ).toHaveLength(0);
});

it("Does not bodyguard a location", () => {
  const testStore = new TestStore(
    {
      play: [ladyTremaine],
    },
    {
      play: [simbaProtectiveCub, prideLandsJungleOasis],
    },
  );

  const attacker = testStore.getCard(ladyTremaine);
  const defender = testStore.getCard(prideLandsJungleOasis);

  const bodyguard = testStore.getCard(simbaProtectiveCub);
  bodyguard.updateCardMeta({ exerted: true });

  attacker.challenge(defender);

  expect(defender.isBodyGuarded(attacker)).toBeFalsy();
  expect(defender.meta?.damage).toEqual(attacker.strength);
  expect(
    testStore.store.tableStore.getTable("player_one").turn.challenges,
  ).toHaveLength(1);
});

it("Let players challenge bodyguards", () => {
  const testStore = new TestStore(
    {
      play: [ladyTremaine],
    },
    {
      play: [simbaProtectiveCub, heiheiBoatSnack],
    },
  );

  const cards2 = testStore.store.tableStore.getPlayerZone(
    "player_two",
    "play",
  )?.cards;
  if (cards2) {
    for (const card of cards2) {
      card.updateCardMeta({ exerted: true });
    }
  }

  const attacker = testStore.getCard(ladyTremaine);
  const defender = testStore.getCard(heiheiBoatSnack);
  const bodyguard = testStore.getCard(simbaProtectiveCub);

  attacker.challenge(bodyguard);

  // Bodyguard should prevent the challenge from happening, in case of an invalid target
  expect(attacker.meta?.damage).toEqual(bodyguard.strength);
  expect(bodyguard.meta?.damage).toEqual(attacker.strength);
  expect(defender.meta?.damage).toBeFalsy();
  expect(
    testStore.store.tableStore.getTable("player_one").turn.challenges,
  ).toHaveLength(1);
});

it("more than one bodyguards", () => {
  const testStore = new TestStore(
    {
      play: [ladyTremaine],
    },
    {
      play: [simbaProtectiveCub, herculesTrueHero, heiheiBoatSnack],
    },
  );

  const cards3 = testStore.store.tableStore.getPlayerZone(
    "player_two",
    "play",
  )?.cards;
  if (cards3) {
    for (const card of cards3) {
      card.updateCardMeta({ exerted: true });
    }
  }

  const attacker = testStore.getCard(ladyTremaine);
  const defender = testStore.getCard(heiheiBoatSnack);
  const bodyguard = testStore.getCard(simbaProtectiveCub);
  const _anotherBodyguard = testStore.getCard(herculesTrueHero);

  attacker.challenge(bodyguard);

  // Bodyguard should prevent the challenge from happening, in case of an invalid target
  expect(attacker.meta?.damage).toEqual(bodyguard.strength);
  expect(bodyguard.meta?.damage).toEqual(attacker.strength);
  expect(defender.meta?.damage).toBeFalsy();
  expect(
    testStore.store.tableStore.getTable("player_one").turn.challenges,
  ).toHaveLength(1);
});

describe("Bodyguard and Evasive", () => {
  it("attacker has evasive", () => {
    const testStore = new TestStore(
      {
        play: [tinkerBellMostHelpful],
      },
      {
        play: [testCard, heiheiBoatSnack],
      },
    );

    const cards4 = testStore.store.tableStore.getPlayerZone(
      "player_two",
      "play",
    )?.cards;
    if (cards4) {
      for (const card of cards4) {
        card.updateCardMeta({ exerted: true });
      }
    }

    const attacker = testStore.getCard(tinkerBellMostHelpful);
    const defender = testStore.getCard(heiheiBoatSnack);
    const bodyguard = testStore.getCard(testCard);

    attacker.challenge(defender);

    // Bodyguard should prevent the challenge from happening, as attacker has evasive
    expect(
      testStore.store.tableStore.getTable("player_one").turn.challenges,
    ).toHaveLength(0);

    expect(defender.meta?.damage).toBeFalsy();
    expect(attacker.meta?.damage).toBeFalsy();

    attacker.challenge(bodyguard);

    // But it does let you challenge the bodyguard
    expect(
      testStore.store.tableStore.getTable("player_one").turn.challenges,
    ).toHaveLength(1);
    expect(attacker.meta?.damage).toEqual(bodyguard.strength);
    expect(bodyguard.meta?.damage).toEqual(attacker.strength);
    expect(defender.meta?.damage).toBeFalsy();
  });

  it("attacker does NOT have evasive", () => {
    const testStore = new TestStore(
      {
        play: [ladyTremaine],
      },
      {
        play: [testCard, heiheiBoatSnack],
      },
    );

    const cards5 = testStore.store.tableStore.getPlayerZone(
      "player_two",
      "play",
    )?.cards;
    if (cards5) {
      for (const card of cards5) {
        card.updateCardMeta({ exerted: true });
      }
    }

    const attacker = testStore.getCard(ladyTremaine);
    const defender = testStore.getCard(heiheiBoatSnack);
    const bodyguard = testStore.getCard(testCard);

    expect(attacker.hasEvasive).toBeFalsy();
    expect(defender.hasEvasive).toBeFalsy();
    expect(bodyguard.hasEvasive).toBeTruthy();

    attacker.challenge(defender);

    // Bodyguard should NOT prevent the challenge from happening, as attacker DOES NOT have evasive
    expect(
      testStore.store.tableStore.getTable("player_one").turn.challenges,
    ).toHaveLength(1);

    expect(defender.meta?.damage).toEqual(attacker.strength);
    expect(attacker.meta?.damage).toEqual(defender.strength);
  });
});
