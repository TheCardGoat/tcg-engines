// CR 8.3 (Bodyguard), 8.10 (Shift), 8.11 (Singer), 8.13 (Support).
import { describe, expect, it } from "bun:test";
import type { CharacterCard } from "@tcg/lorcana-types";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import {
  judyHoppsDayCampInstructor,
  nickWildeToyDriveOfficer,
  lionheartIncumbentMayor,
  clawhauserSafetyOfficer,
  goofyDancingSuperstar,
  ernestoDeLaCruzIdolOfMillions,
  ernestoDeLaCruzRuthlessMusician,
  powerlineMegastar,
  honeyLemonIngeniousResearcher,
  belleExceptionalWriter,
  tianaPartyHostess,
  donKarnageDebonairPirate,
  cinderellaUnintentionalIconIconic,
} from "./index";

const supportCards: CharacterCard[] = [judyHoppsDayCampInstructor, nickWildeToyDriveOfficer];
const bodyguards: CharacterCard[] = [lionheartIncumbentMayor, clawhauserSafetyOfficer];
const singers: { card: CharacterCard; value: number }[] = [
  { card: goofyDancingSuperstar, value: 6 },
  { card: ernestoDeLaCruzIdolOfMillions, value: 5 },
  { card: ernestoDeLaCruzRuthlessMusician, value: 8 },
  { card: powerlineMegastar, value: 9 },
];
const shifts: { card: CharacterCard; cost: number }[] = [
  { card: honeyLemonIngeniousResearcher, cost: 5 },
  { card: belleExceptionalWriter, cost: 3 },
  { card: tianaPartyHostess, cost: 5 },
  { card: donKarnageDebonairPirate, cost: 4 },
  { card: cinderellaUnintentionalIconIconic, cost: 5 },
];
describe("Hyperia printed keyword gameplay", () => {
  for (const card of supportCards) {
    it(`${card.name} - ${card.version}: Support adds Strength and expires`, () => {
      const ally = createMockCharacter({ id: "support-ally", name: "Ally", cost: 1, strength: 1 });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card, isDrying: false }, ally], deck: 2 },
        { deck: 2 },
      );
      expect(game.asPlayerOne().quest(card)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(card, { resolveOptional: true, targets: [ally] }),
      ).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardStrength(ally)).toBe(1 + card.strength);
      expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardStrength(ally)).toBe(1);
    });
  }
  for (const card of bodyguards) {
    it(`${card.name} - ${card.version}: Bodyguard protects another character`, () => {
      const ally = createMockCharacter({ id: "bodyguard-ally", name: "Ally", cost: 1 });
      const attacker = createMockCharacter({ id: "bodyguard-attacker", name: "Attacker", cost: 1 });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [{ card: attacker, isDrying: false }] },
        {
          play: [
            { card, exerted: true },
            { card: ally, exerted: true },
          ],
        },
      );
      expect(game.asPlayerOne().challenge(attacker, ally)).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().challenge(attacker, card)).toBeSuccessfulCommand();
    });
  }
  for (const { card, value } of singers) {
    for (const cost of [value, value + 1]) {
      it(`${card.name} - ${card.version}: Singer ${value} and song cost ${cost}`, () => {
        const song = createMockSong({
          id: `boundary-song-${cost}`,
          name: "Boundary Song",
          cost,
          text: "",
        });
        const game = LorcanaMultiplayerTestEngine.createWithFixture({
          play: [{ card, isDrying: false }],
          hand: [song],
          inkwell: 0,
          deck: 5,
        });
        const result = game.asPlayerOne().singSong(song, card);
        if (cost === value) {
          expect(result).toBeSuccessfulCommand();
          expect(game.asPlayerOne().isExerted(card)).toBe(true);
          expect(game.asPlayerOne().getCardZone(song)).toBe("discard");
        } else {
          expect(result).not.toBeSuccessfulCommand();
          expect(game.asPlayerOne().isExerted(card)).toBe(false);
          expect(game.asPlayerOne().getCardZone(song)).toBe("hand");
        }
      });
    }
  }
  for (const { card, cost } of shifts) {
    it(`${card.name} - ${card.version}: Shift pays ${cost} ink and keeps its base`, () => {
      const base = createMockCharacter({ id: "shift-base", name: card.name, cost: 1, lore: 1 });
      const game = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [card],
        play: [{ card: base, isDrying: false }],
        inkwell: cost,
        deck: 6,
      });
      const shiftTarget = game.findCardInstanceId(base, "play", PLAYER_ONE);
      expect(
        game.asPlayerOne().playCard(card, { cost: { cost: "shift", shiftTarget } }),
      ).toBeSuccessfulCommand();
      expect(game.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
      expect(game.asPlayerOne().getCardZone(card)).toBe("play");
      expect(game.asPlayerOne().getCardsUnderCount(card)).toBe(1);
    });
  }
});
