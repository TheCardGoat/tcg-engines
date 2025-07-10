/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";

import {
  allCardsById,
  type LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import {
  dragonFire,
  workTogether,
} from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { mickeyMouseArtfulRogue } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  beastForbiddingRecluse,
  beastTragicHero,
  mickeyMouseFriendlyFace,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import {
  beastThickSkinned,
  mickeyMousePlayfulSorcerer,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { hiddenCoveTranquilHaven } from "@lorcanito/lorcana-engine/cards/004/locations/locations";
import { thunderboltWonderDog } from "@lorcanito/lorcana-engine/cards/007";
import { dalmatianPuppyTailWagger } from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const anotherTestCard: LorcanitoActionCard = {
  ...actionCardMock,
  id: "shift-test-card",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "move",
          to: "hand",
          target: chosenCharacter,
        },
      ],
    },
  ],
};

allCardsById[anotherTestCard.id] = anotherTestCard;

it("Shifts glimmer", async () => {
  const testEngine = new TestEngine({
    inkwell: 3,
    play: [beastForbiddingRecluse],
    hand: [beastTragicHero],
  });

  const { shifter } = await testEngine.shiftCard({
    shifted: beastForbiddingRecluse,
    shifter: beastTragicHero,
  });

  expect(shifter.zone).toEqual("play");
});

it("Removing shifter glimmer also removes shifted", () => {
  const testStore = new TestStore({
    play: [beastForbiddingRecluse],
    inkwell: 3 + dragonFire.cost,
    hand: [beastTragicHero, dragonFire],
  });

  const cardUnderTest = testStore.getByZoneAndId("hand", beastTragicHero.id);
  const shifted = testStore.getByZoneAndId("play", beastForbiddingRecluse.id);
  const removal = testStore.getByZoneAndId("hand", dragonFire.id);

  testStore.store.cardStore.shiftCard(cardUnderTest, shifted);

  removal.playFromHand();
  testStore.resolveTopOfStack({ targets: [cardUnderTest] });

  expect(cardUnderTest.zone).toEqual("discard");
  expect(shifted.zone).toEqual("discard");
});

it("Move one to hand and other to discard when returning it to hand", () => {
  const testStore = new TestStore({
    inkwell: anotherTestCard.cost + 3,
    play: [beastForbiddingRecluse],
    hand: [beastTragicHero, anotherTestCard],
  });

  const cardUnderTest = testStore.getByZoneAndId("hand", beastTragicHero.id);
  const shifted = testStore.getByZoneAndId("play", beastForbiddingRecluse.id);
  const removal = testStore.getCard(anotherTestCard);

  testStore.store.cardStore.shiftCard(cardUnderTest, shifted);

  // TODO: For now shift cards count as being in discard, we should check ruling
  expect(shifted.zone).toEqual("play");

  removal.playFromHand();
  testStore.resolveTopOfStack({ targets: [cardUnderTest] });

  expect(cardUnderTest.zone).toEqual("hand");
  expect(shifted.zone).toEqual("hand");
});

it("Moves to a location and then shifts", () => {
  const testStore = new TestStore({
    inkwell: 3 + hiddenCoveTranquilHaven.moveCost,
    play: [beastForbiddingRecluse, hiddenCoveTranquilHaven],
    hand: [beastTragicHero],
  });

  const shifter = testStore.getCard(beastTragicHero);
  const shifted = testStore.getCard(beastForbiddingRecluse);
  const location = testStore.getCard(hiddenCoveTranquilHaven);

  shifted.enterLocation(location);

  expect(shifted.isAtLocation(location)).toEqual(true);
  expect(location.containsCharacter(shifted)).toEqual(true);

  const moveResponse = testStore.store.cardStore.shiftCard(shifter, shifted);

  expect(moveResponse.success).toBeTruthy();

  expect(shifted.isAtLocation(location)).toBeFalsy();
  expect(location.containsCharacter(shifted)).toBeFalsy();

  expect(shifter.isAtLocation(location)).toEqual(true);
  expect(location.containsCharacter(shifter)).toEqual(true);
});

it("Quest only with the shifter", async () => {
  const testEngine = new TestEngine({
    inkwell: 3 + 5,
    play: [mickeyMouseFriendlyFace],
    hand: [mickeyMousePlayfulSorcerer, mickeyMouseArtfulRogue],
  });

  const { shifter: sorcerer, shifted: mickey } = await testEngine.shiftCard({
    shifted: mickeyMouseFriendlyFace,
    shifter: mickeyMousePlayfulSorcerer,
  });

  await testEngine.skipTopOfStack();
  const { shifter: rogue } = await testEngine.shiftCard({
    shifted: mickeyMousePlayfulSorcerer,
    shifter: mickeyMouseArtfulRogue,
  });

  await testEngine.questWithAll("player_one");

  expect(testEngine.getLoreForPlayer("player_one")).toEqual(rogue.lore);
});

it("Shifted character can be target to another shift", async () => {
  const testEngine = new TestEngine({
    inkwell: 3 + 5,
    play: [mickeyMouseFriendlyFace],
    hand: [mickeyMousePlayfulSorcerer, mickeyMouseArtfulRogue],
  });

  const { shifter: _sorcerer, shifted: _mickey } = await testEngine.shiftCard({
    shifted: mickeyMouseFriendlyFace,
    shifter: mickeyMousePlayfulSorcerer,
  });
  await testEngine.skipTopOfStack();
  expect(_sorcerer.zone).toEqual("play");

  const { shifter: rogue } = await testEngine.shiftCard({
    shifted: mickeyMousePlayfulSorcerer,
    shifter: mickeyMouseArtfulRogue,
  });
  expect(rogue.zone).toEqual("play");

  expect(_mickey.meta).toEqual(
    expect.objectContaining({
      shifted: undefined,
      shifter: _sorcerer.instanceId,
    }),
  );
  expect(_sorcerer.meta).toEqual(
    expect.objectContaining({
      shifted: _mickey.instanceId,
      shifter: rogue.instanceId,
    }),
  );
  expect(rogue.meta).toEqual(
    expect.objectContaining({
      shifted: _sorcerer.instanceId,
      shifter: undefined,
    }),
  );
});

it("Move all cards to discard when banished", async () => {
  const testEngine = new TestEngine({
    inkwell: 3 + 5 + dragonFire.cost,
    play: [mickeyMouseFriendlyFace],
    hand: [mickeyMousePlayfulSorcerer, mickeyMouseArtfulRogue, dragonFire],
  });

  const { shifter: sorcerer, shifted: mickey } = await testEngine.shiftCard({
    shifted: mickeyMouseFriendlyFace,
    shifter: mickeyMousePlayfulSorcerer,
  });
  await testEngine.skipTopOfStack();
  const { shifter: rogue } = await testEngine.shiftCard({
    shifted: mickeyMousePlayfulSorcerer,
    shifter: mickeyMouseArtfulRogue,
  });

  expect(mickey.zone).toEqual("play");
  expect(sorcerer.zone).toEqual("play");
  expect(rogue.zone).toEqual("play");

  await testEngine.playCard(dragonFire, { targets: [rogue] });

  expect(mickey.zone).toEqual("discard");
  expect(sorcerer.zone).toEqual("discard");
  expect(rogue.zone).toEqual("discard");
});

it(
  "10.8.3. A shifted character takes on the state of the character it was placed on (e.g., it's dry if the character it was placed on was dry,\n" +
    "it's exerted if the character it was placed on was exerted).",
  async () => {
    const testEngine = new TestEngine({
      inkwell: 3 + beastThickSkinned.cost,
      hand: [beastTragicHero, beastThickSkinned],
    });

    const expectedMeta = { exerted: true, playedThisTurn: true };
    const shifter = testEngine.getCardModel(beastThickSkinned);

    await testEngine.playCard(beastThickSkinned);
    await testEngine.tapCard(beastThickSkinned);

    expect(shifter.meta).toEqual(expect.objectContaining(expectedMeta));

    const { shifted } = await testEngine.shiftCard({
      shifted: beastThickSkinned,
      shifter: beastTragicHero,
    });

    expect(shifted.meta).toEqual(expect.objectContaining(expectedMeta));
  },
);

it.skip("10.8.4. If an effect on a shifted character causes it to enter play exerted, it becomes exerted as it enters play.", async () => {
  const testEngine = new TestEngine({
    inkwell: 3,
    play: [beastForbiddingRecluse],
    hand: [beastTragicHero],
  });

  const _cardModel = await testEngine.shiftCard({
    shifted: beastForbiddingRecluse,
    shifter: beastTragicHero,
  });
});

describe(
  "10.8.5. A shifted character retains whatever damage was on the character it was placed on. It loses all text of the character it was\n" +
    "placed on but keeps any effects that applied to that character when the shifted character enters play.",
  () => {
    it("Passes damage to shifted character", async () => {
      const testEngine = new TestEngine({
        inkwell: 3 + workTogether.cost,
        play: [beastForbiddingRecluse],
        hand: [beastTragicHero, workTogether],
      });

      await testEngine.setCardDamage(beastForbiddingRecluse, 2);

      const { shifter } = await testEngine.shiftCard({
        shifted: beastForbiddingRecluse,
        shifter: beastTragicHero,
      });

      expect(shifter.damage).toEqual(2);
    });

    it("Passes continuous effects to shifted character", async () => {
      const testEngine = new TestEngine({
        inkwell: 3 + workTogether.cost,
        play: [beastForbiddingRecluse],
        hand: [beastTragicHero, workTogether],
      });
      const shifted = testEngine.getCardModel(beastForbiddingRecluse);

      expect(shifted.hasSupport).toEqual(false);
      await testEngine.playCard(workTogether, {
        targets: [beastForbiddingRecluse],
      });
      expect(shifted.hasSupport).toEqual(true);

      const { shifter } = await testEngine.shiftCard({
        shifted: beastForbiddingRecluse,
        shifter: beastTragicHero,
      });

      expect(shifter.hasSupport).toEqual(true);
    });
  },
);

it.skip(
  "When a shifted character leaves play, all cards in its stack (i.e., the card it was played on and any other cards beneath that one)\n" +
    "go to the same zone as the shifted character card does, and the cards are no longer considered to be in a stack.",
  async () => {
    const testEngine = new TestEngine({
      inkwell: 3,
      play: [beastForbiddingRecluse],
      hand: [beastTragicHero],
    });

    await testEngine.shiftCard({
      shifted: beastForbiddingRecluse,
      shifter: beastTragicHero,
    });
  },
);

it("Shifted character with Bodyguard can enter play exerted", async () => {
  const testEngine = new TestEngine({
    inkwell: thunderboltWonderDog.cost,
    play: [dalmatianPuppyTailWagger],
    hand: [thunderboltWonderDog],
  });

  await testEngine.shiftCard({
    shifted: dalmatianPuppyTailWagger,
    shifter: thunderboltWonderDog,
  });

  await testEngine.acceptOptionalLayer();

  expect(testEngine.getCardModel(thunderboltWonderDog).exerted).toEqual(true);
});
