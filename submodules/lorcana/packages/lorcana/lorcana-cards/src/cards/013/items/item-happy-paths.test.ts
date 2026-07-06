import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { brokenPod } from "./070-broken-pod";
import { sourceOfTheVine } from "./072-source-of-the-vine";
import { potato } from "./105-potato";
import { vinePod } from "./107-vine-pod";
import { closetDoorPortal } from "./170-closet-door-portal";
import { hanasInkcaster } from "./171-hanas-inkcaster";
import { laughCanister } from "./172-laugh-canister";
import { theWeedwhacker } from "./205-the-weedwhacker";
import { absorbingBloom } from "./206-absorbing-bloom";

const itemTarget = createMockCharacter({
  id: "set13-item-target",
  name: "Item Target",
  cost: 2,
});

const vinelingTarget = createMockCharacter({
  id: "set13-item-vineling-target",
  name: "Vineling Target",
  cost: 2,
  classifications: ["Floodborn", "Vineling"],
});

const bloomAttacker = createMockCharacter({
  id: "set13-absorbing-bloom-attacker",
  name: "Bloom Attacker",
  cost: 2,
  strength: 5,
  willpower: 3,
});

const bloomDefender = createMockCharacter({
  id: "set13-absorbing-bloom-defender",
  name: "Bloom Defender",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const bloomDeckCard = createMockCharacter({
  id: "set13-absorbing-bloom-deck-card",
  name: "Bloom Deck Card",
  cost: 1,
});

const brokenPodDiscardCard = createMockCharacter({
  id: "set13-broken-pod-discard-card",
  name: "Broken Pod Discard Card",
  cost: 1,
});

const sourceQuestingCharacter = createMockCharacter({
  id: "set13-source-of-vine-quester",
  name: "Source Questing Character",
  cost: 1,
  lore: 1,
});

const vinePodOldCharacter = createMockCharacter({
  id: "set13-vine-pod-old-character",
  name: "Regenerate Target",
  cost: 1,
});

const vinePodNewCharacter = createMockCharacter({
  id: "set13-vine-pod-new-character",
  name: "Regenerate Target",
  cost: 5,
});

const closetDoorCharacter = createMockCharacter({
  id: "set13-closet-door-character",
  name: "Closet Door Character",
  cost: 6,
});

const closetDoorRest = createMockCharacter({
  id: "set13-closet-door-rest",
  name: "Closet Door Rest",
  cost: 1,
});

const hanaTarget = createMockCharacter({
  id: "set13-hana-target",
  name: "Hana Target",
  cost: 2,
  willpower: 5,
});

const hanaUnderCard = createMockCharacter({
  id: "set13-hana-under-card",
  name: "Hana Under Card",
  cost: 1,
});

const laughOwnDeck = createMockCharacter({
  id: "set13-laugh-own-deck",
  name: "Laugh Own Deck",
  cost: 1,
});

const laughOpponentDeck = createMockCharacter({
  id: "set13-laugh-opponent-deck",
  name: "Laugh Opponent Deck",
  cost: 1,
});

describe("Set 13 item happy paths", () => {
  it("Potato enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [potato],
      inkwell: potato.cost,
    });

    expect(testEngine.asPlayerOne().playCard(potato)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(potato)).toBe(true);
  });

  it("The Weedwhacker gives chosen character Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theWeedwhacker, itemTarget],
      inkwell: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theWeedwhacker, {
        ability: "FULL POWER",
        targets: [itemTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(itemTarget, "Challenger")).toBe(2);
  });

  it("The Weedwhacker banishes itself to banish a chosen Vineling character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [theWeedwhacker, vinelingTarget],
      inkwell: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theWeedwhacker, {
        ability: "CLEAR-CUT",
        targets: [vinelingTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(vinelingTarget)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(theWeedwhacker)).toBe("discard");
  });

  it("Absorbing Bloom draws a card if a character was banished in a challenge this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [absorbingBloom, bloomAttacker],
        deck: [bloomDeckCard],
        inkwell: 1,
      },
      {
        play: [{ card: bloomDefender, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(bloomAttacker, bloomDefender),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(bloomDefender)).toBe("discard");
    expect(testEngine.asPlayerOne().activateAbility(absorbingBloom)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(bloomDeckCard)).toBe("hand");
  });

  it("Broken Pod puts a chosen discard card on the bottom of its owner's deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [brokenPod],
      discard: [brokenPodDiscardCard],
      inkwell: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(brokenPod, {
        targets: [brokenPodDiscardCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(brokenPodDiscardCard)).toBe("deck");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)[0]).toBe(
      brokenPodDiscardCard.id,
    );
  });

  it("Broken Pod preserves ownership when targeting an opponent's discard card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [brokenPod],
        inkwell: 1,
      },
      {
        discard: [brokenPodDiscardCard],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(brokenPod, {
        targets: [brokenPodDiscardCard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(brokenPodDiscardCard)).toBe("deck");
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_TWO)[0]).toBe(
      brokenPodDiscardCard.id,
    );
    expect(testEngine.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).not.toContain(
      brokenPodDiscardCard.id,
    );
  });

  it("Source of the Vine gains lore when the opposing questing player does not pay", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [sourceOfTheVine],
      },
      {
        play: [{ card: sourceQuestingCharacter, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().quest(sourceQuestingCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(sourceOfTheVine)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWithChoice(1)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Source of the Vine's Radiant Bloom gains 1 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sourceOfTheVine],
      inkwell: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(sourceOfTheVine, {
        ability: "RADIANT BLOOM",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("Vine Pod enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [vinePod],
      inkwell: vinePod.cost,
    });

    expect(testEngine.asPlayerOne().playCard(vinePod)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(vinePod)).toBe(true);
  });

  it("Vine Pod may play a same-name character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [vinePodNewCharacter],
      play: [{ card: vinePod, exerted: false }, vinePodOldCharacter],
      inkwell: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(vinePod, {
        ability: "REGENERATE",
        targets: [vinePodOldCharacter],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(vinePod, {
        resolveOptional: true,
        targets: [vinePodNewCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(vinePodOldCharacter)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(vinePodNewCharacter)).toBe("play");
  });

  it("Closet Door Portal enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [closetDoorPortal],
      inkwell: closetDoorPortal.cost,
    });

    expect(testEngine.asPlayerOne().playCard(closetDoorPortal)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(closetDoorPortal)).toBe(true);
  });

  it("Closet Door Portal plays a revealed card for free and inks itself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: closetDoorPortal, exerted: false }],
      deck: [closetDoorCharacter, closetDoorRest],
      inkwell: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(closetDoorPortal, {
        ability: "WHO'S THERE?",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "play", cards: [closetDoorCharacter] },
          { zone: "deck-bottom", cards: [closetDoorRest] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(closetDoorCharacter)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(closetDoorPortal)).toBe("inkwell");
  });

  it("Hana's Inkcaster removes damage and gives Resist when the target has a card under it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hanasInkcaster, { card: hanaTarget, damage: 3, cardsUnder: [hanaUnderCard] }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(hanasInkcaster, {
        targets: [hanaTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(hanaTarget)).toBe(1);
    expect(testEngine.asPlayerOne().getKeywordValue(hanaTarget, "Resist")).toBe(1);
  });

  it("Laugh Canister puts the top card of each accepting player's deck into their inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [laughCanister],
        deck: [laughOwnDeck],
      },
      {
        deck: [laughOpponentDeck],
      },
    );

    expect(testEngine.asPlayerOne().activateAbility(laughCanister)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolveNextPending({ resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(laughOwnDeck)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(laughOpponentDeck)).toBe("inkwell");
    expect(testEngine.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });
});
