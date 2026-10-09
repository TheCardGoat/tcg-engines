/**
 * Hyperia City (set 014) vanilla characters: engine behavior test.
 *
 * Vanilla characters have no printed ability, so playing them must simply
 * produce a card in play with the printed stats and lore value. Expected
 * values mirror the printed source data (see card-data.test.ts).
 */

import { describe, expect, it } from "bun:test";
import type { CharacterCard } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fruFruVipGuest } from "./001-fru-fru-vip-guest";
import { abuelitaLovingGrandmother } from "./002-abuelita-loving-grandmother";
import { yaxConcertGoer } from "./008-yax-concert-goer";
import { scuttleDirectingTraffic } from "./036-scuttle-directing-traffic";
import { davidXanatosArcaneIndustrialist } from "./037-david-xanatos-arcane-industrialist";
import { tinkerBellCuriousFairy } from "./045-tinker-bell-curious-fairy";
import { trustyAlongForTheRide } from "./069-trusty-along-for-the-ride";
import { donKarnageKhansCourier } from "./070-don-karnage-khans-courier";
import { captainHookConcernedCaptain } from "./077-captain-hook-concerned-captain";
import { abigailCallaghanSeasonedTestPilot } from "./108-abigail-callaghan-seasoned-test-pilot";
import { pepitaSweetKitty } from "./109-pepita-sweet-kitty";
import { staceyPowerlineSuperfan } from "./116-stacey-powerline-superfan";
import { carlFredricksenWildernessGuide } from "./137-carl-fredricksen-wilderness-guide";
import { abigailAmeliaGossipingGeese } from "./143-abigail-amelia-gossiping-geese";
import { goGoTomagoWorkingLate } from "./145-go-go-tomago-working-late";
import { kitCloudkickerUnpredictableCourier } from "./174-kit-cloudkicker-unpredictable-courier";
import { ticktockCanalCroc } from "./175-tick-tock-canal-croc";
import { koslovImposingEnforcer } from "./189-koslov-imposing-enforcer";

const vanillaCharacters: Array<{
  card: CharacterCard;
  cost: number;
  strength: number;
  willpower: number;
  lore: number;
}> = [
  { card: fruFruVipGuest, cost: 1, strength: 1, willpower: 3, lore: 1 },
  { card: abuelitaLovingGrandmother, cost: 3, strength: 3, willpower: 3, lore: 2 },
  { card: yaxConcertGoer, cost: 7, strength: 7, willpower: 9, lore: 2 },
  { card: scuttleDirectingTraffic, cost: 2, strength: 1, willpower: 3, lore: 2 },
  { card: davidXanatosArcaneIndustrialist, cost: 5, strength: 6, willpower: 5, lore: 2 },
  { card: tinkerBellCuriousFairy, cost: 1, strength: 0, willpower: 4, lore: 1 },
  { card: trustyAlongForTheRide, cost: 5, strength: 4, willpower: 7, lore: 2 },
  { card: donKarnageKhansCourier, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: captainHookConcernedCaptain, cost: 8, strength: 9, willpower: 9, lore: 3 },
  { card: abigailCallaghanSeasonedTestPilot, cost: 5, strength: 7, willpower: 6, lore: 1 },
  { card: pepitaSweetKitty, cost: 1, strength: 1, willpower: 3, lore: 1 },
  { card: staceyPowerlineSuperfan, cost: 3, strength: 2, willpower: 2, lore: 3 },
  { card: carlFredricksenWildernessGuide, cost: 6, strength: 5, willpower: 6, lore: 3 },
  { card: abigailAmeliaGossipingGeese, cost: 2, strength: 2, willpower: 2, lore: 2 },
  { card: goGoTomagoWorkingLate, cost: 3, strength: 2, willpower: 6, lore: 1 },
  { card: kitCloudkickerUnpredictableCourier, cost: 1, strength: 2, willpower: 2, lore: 1 },
  { card: ticktockCanalCroc, cost: 8, strength: 9, willpower: 9, lore: 3 },
  { card: koslovImposingEnforcer, cost: 4, strength: 4, willpower: 4, lore: 2 },
];

describe("Hyperia City vanilla characters", () => {
  it.each(vanillaCharacters)(
    "$card.name - $card.version is banished at printed willpower",
    (entry: (typeof vanillaCharacters)[number]) => {
      const attacker = createMockCharacter({
        id: "vanilla-lethal-attacker",
        cost: 1,
        name: "Lethal Attacker",
        strength: 1,
        willpower: 20,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: entry.card, exerted: true, damage: entry.willpower - 1 }], deck: 6 },
        { play: [attacker], deck: 6 },
      );
      expect(game.asPlayerOne().getCardZone(entry.card)).toBe("play");
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().challenge(attacker, entry.card)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(entry.card)).toBe("discard");
      expect(game.asPlayerTwo().getDamage(attacker)).toBe(entry.strength);
      expect(game.asPlayerTwo().getCardZone(attacker)).toBe("play");
    },
  );
  it.each(vanillaCharacters)(
    "$card.name - $card.version deals printed retaliation and takes attacker damage",
    (entry: (typeof vanillaCharacters)[number]) => {
      const attacker = createMockCharacter({
        id: "vanilla-retaliation-attacker",
        name: "Attacker",
        cost: 1,
        strength: 1,
        willpower: 20,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: entry.card, exerted: true }], deck: 6 },
        { play: [attacker], deck: 6 },
      );
      expect(engine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(engine.asPlayerTwo().challenge(attacker, entry.card)).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getDamage(entry.card)).toBe(1);
      expect(engine.asPlayerTwo().getDamage(attacker)).toBe(entry.strength);
      expect(engine.asPlayerOne().getCardZone(entry.card)).toBe("play");
      expect(engine.asPlayerTwo().getCardZone(attacker)).toBe("play");
      expect(engine.isExerted(attacker)).toBe(true);
    },
  );
  it.each(vanillaCharacters)(
    "$card.name - $card.version enters play with the printed stats",
    (entry: (typeof vanillaCharacters)[number]) => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [entry.card],
        inkwell: entry.cost,
        deck: 2,
      });
      expect(testEngine.asPlayerOne().playCard(entry.card)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(entry.card)).toBe("play");

      expect(entry.card.vanilla).toBe(true);
      const cardUnderTest = testEngine.asPlayerOne().getCard(entry.card);
      expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(entry.card.cost).toBe(entry.cost);
      expect(testEngine.asPlayerOne().getCardStrength(entry.card)).toBe(entry.strength);
      expect(cardUnderTest.willpower).toBe(entry.willpower);
      expect(cardUnderTest.lore).toBe(entry.lore);
    },
  );
  it.each(vanillaCharacters)(
    "$card.name - $card.version quests for printed lore",
    (entry: (typeof vanillaCharacters)[number]) => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: entry.card, isDrying: false }],
        deck: [],
      });
      expect(testEngine.asPlayerOne().quest(entry.card)).toBeSuccessfulCommand();
      expect(testEngine.getLore(PLAYER_ONE)).toBe(entry.lore);
      expect(testEngine.asPlayerOne().isExerted(entry.card)).toBe(true);
    },
  );
  it.each(vanillaCharacters)(
    "$card.name - $card.version deals printed challenge damage",
    (entry: (typeof vanillaCharacters)[number]) => {
      const defender = createMockCharacter({
        id: "vanilla-defender",
        name: "Defender",
        cost: 1,
        strength: 0,
        willpower: 20,
      });
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: entry.card, isDrying: false }],
          deck: [],
        },
        { play: [{ card: defender, exerted: true }] },
      );
      expect(testEngine.asPlayerOne().challenge(entry.card, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getDamage(defender)).toBe(entry.strength);
      expect(testEngine.asPlayerOne().isExerted(entry.card)).toBe(true);
    },
  );
});

describe("Hyperia vanilla play boundaries", () => {
  it.each(vanillaCharacters)(
    "$card.name - $card.version supports player two paid entry and next-turn questing",
    (entry: (typeof vanillaCharacters)[number]) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { deck: 6 },
        { hand: [entry.card], inkwell: entry.cost, deck: 6 },
      );
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().playCard(entry.card)).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
      expect(game.asPlayerTwo().getBagCount()).toBe(0);
      expect(game.asPlayerTwo().quest(entry.card)).not.toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().quest(entry.card)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_TWO)).toBe(entry.lore);
      expect(game.getLore(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerTwo().isExerted(entry.card)).toBe(true);
    },
  );

  it.each(vanillaCharacters)(
    "$card.name - $card.version follows its printed inkability",
    (entry: (typeof vanillaCharacters)[number]) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [entry.card],
        deck: [],
      });
      // Every character in this printed-data table has an ink icon.
      expect(game.asPlayerOne().putIntoInkwell(PLAYER_ONE, entry.card)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(entry.card)).toBe("inkwell");
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(game.asPlayerOne().getBagCount()).toBe(0);
      expect(game.getLore(PLAYER_ONE)).toBe(0);
    },
  );
  it.each(vanillaCharacters)(
    "$card.name - $card.version rejects insufficient play ink without payment",
    (entry: (typeof vanillaCharacters)[number]) => {
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [entry.card],
        inkwell: entry.cost - 1,
        deck: 2,
      });
      expect(game.asPlayerOne().playCard(entry.card)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(entry.card)).toBe("hand");
      expect(game.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(entry.cost - 1);
      expect(game.asPlayerOne().getBagCount()).toBe(0);
    },
  );
  it.each(vanillaCharacters)(
    "$card.name - $card.version remains drying and has no play trigger",
    (entry: (typeof vanillaCharacters)[number]) => {
      const defender = createMockCharacter({
        id: "vanilla-drying-defender",
        name: "Drying Defender",
        cost: 1,
        strength: 0,
        willpower: 20,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [entry.card], inkwell: entry.cost, deck: 2 },
        { play: [{ card: defender, exerted: true }], deck: 2 },
      );
      expect(game.asPlayerOne().playCard(entry.card)).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getBagCount()).toBe(0);
      expect(game.asPlayerOne().quest(entry.card)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().challenge(entry.card, defender)).not.toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().isExerted(entry.card)).toBe(false);
      expect(game.asPlayerTwo().getDamage(defender)).toBe(0);
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerOne().quest(entry.card)).toBeSuccessfulCommand();
      expect(game.getLore(PLAYER_ONE)).toBe(entry.lore);
    },
  );
});
