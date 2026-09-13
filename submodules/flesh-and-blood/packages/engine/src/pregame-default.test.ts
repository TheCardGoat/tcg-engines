import { describe, expect, it } from "vitest";
import { toFabCardDefinition, type FabCardDefinitionInput } from "./cards.ts";
import {
  createDefaultFabPregameSelection,
  reconcileFabPregameSelection,
  validateFabPregameSelection,
  type FabPregameCardPool,
  type FabPregameFormat,
} from "./pregame.ts";
import { sinkBelow } from "../../cards/src/cards/defense-reactions/sink-below.ts";
import { fateForeseen } from "../../cards/src/cards/defense-reactions/fate-foreseen.ts";
import { woundingBlow } from "../../cards/src/cards/actions/wounding-blow.ts";
import { scarForAScar } from "../../cards/src/cards/actions/scar-for-a-scar.ts";
import { ravenousRabble } from "../../cards/src/cards/actions/ravenous-rabble.ts";
import { nimblism } from "../../cards/src/cards/actions/nimblism.ts";
import { ragingOnslaught } from "../../cards/src/cards/actions/raging-onslaught.ts";
import { bravoShowstopper } from "../../cards/src/cards/heroes/bravo-showstopper.ts";
import { azalea } from "../../cards/src/cards/heroes/azalea.ts";
import { azaleaAceInTheHole } from "../../cards/src/cards/heroes/azalea-ace-in-the-hole.ts";
import { anothos } from "../../cards/src/cards/weapons/anothos.ts";
import { titanSFist } from "../../cards/src/cards/weapons/titan-s-fist.ts";
import { deathDealer } from "../../cards/src/cards/weapons/death-dealer.ts";
import { rampartOfTheRamSHead } from "../../cards/src/cards/equipment/rampart-of-the-ram-s-head.ts";
import { quiverOfAbyssalDepths } from "../../cards/src/cards/equipment/quiver-of-abyssal-depths.ts";
import { ironrotHelm } from "../../cards/src/cards/equipment/ironrot-helm.ts";
import { ironrotPlate } from "../../cards/src/cards/equipment/ironrot-plate.ts";
import { ironrotGauntlet } from "../../cards/src/cards/equipment/ironrot-gauntlet.ts";
import { ironrotLegs } from "../../cards/src/cards/equipment/ironrot-legs.ts";

const deckCards = [
  sinkBelow,
  fateForeseen,
  woundingBlow,
  scarForAScar,
  ravenousRabble,
  nimblism,
  ragingOnslaught,
]
  .flatMap((family) => Object.values(family.cards))
  .map((card) => toFabCardDefinition(card));
const bodyCards = [ironrotHelm, ironrotPlate, ironrotGauntlet, ironrotLegs].map((card) =>
  toFabCardDefinition(card),
);
const hammer = toFabCardDefinition(anothos);
const fist = toFabCardDefinition(titanSFist);
const shield = toFabCardDefinition(rampartOfTheRamSHead);
const bow = toFabCardDefinition(deathDealer);
const quiver = toFabCardDefinition(quiverOfAbyssalDepths);

function pool(
  equipment: readonly FabCardDefinitionInput[],
  format: FabPregameFormat = "cc",
  hero = toFabCardDefinition(bravoShowstopper),
): FabPregameCardPool {
  return {
    format,
    heroId: hero.canonicalId,
    cardDefinitions: Object.fromEntries(
      [hero, ...deckCards, ...bodyCards, ...equipment].map((card) => [card.canonicalId, card]),
    ),
    entries: [
      ...[...bodyCards, ...equipment].map((card) => ({
        canonicalId: card.canonicalId,
        quantity: 1,
        source: "equipment" as const,
      })),
      ...deckCards.map((card, index) => ({
        canonicalId: card.canonicalId,
        quantity: format === "silverAge" ? 2 : 3,
        source: index < 18 ? ("main" as const) : ("inventory" as const),
      })),
    ],
  };
}

// Owns the public pregame selection/validation DTO, not equipment gameplay.
describe("automatic FAB loadout contract with authored cards", () => {
  it("includes all registered deck cards and fills body slots without seating an off-hand beside a 2H weapon", () => {
    const registered = pool([hammer, shield]);
    const selection = createDefaultFabPregameSelection(registered);
    expect(selection.deck).toEqual(
      deckCards.map((card) => ({ canonicalId: card.canonicalId, quantity: 3 })),
    );
    expect(selection.equipment).toEqual({
      head: bodyCards[0]!.canonicalId,
      chest: bodyCards[1]!.canonicalId,
      arms: bodyCards[2]!.canonicalId,
      legs: bodyCards[3]!.canonicalId,
      weapon1: hammer.canonicalId,
    });
    expect(validateFabPregameSelection(registered, selection).valid).toBe(true);
  });

  it("seats a 1H weapon with an off-hand", () => {
    const registered = pool([fist, shield]);
    const selection = createDefaultFabPregameSelection(registered);
    expect(selection.equipment.weapon1).toBe(fist.canonicalId);
    expect(selection.equipment.weapon2).toBe(shield.canonicalId);
    expect(validateFabPregameSelection(registered, selection).valid).toBe(true);
  });

  it.each([false, true])(
    "seats a bow and quiver without losing either card (quiver first: %s)",
    (quiverFirst) => {
      const registered = pool(
        quiverFirst ? [quiver, bow] : [bow, quiver],
        "cc",
        toFabCardDefinition(azaleaAceInTheHole),
      );
      const selection = createDefaultFabPregameSelection(registered);
      expect(selection.equipment.weapon1).toBe(bow.canonicalId);
      expect(selection.equipment.weapon2).toBe(quiver.canonicalId);
      expect(validateFabPregameSelection(registered, selection).valid).toBe(true);
    },
  );

  it("caps exact-size formats at 40, using registered main cards before inventory", () => {
    const registered = pool([], "silverAge", toFabCardDefinition(azalea));
    const selection = createDefaultFabPregameSelection(registered);
    expect(selection.deck).toEqual(
      deckCards.slice(0, 20).map((card) => ({ canonicalId: card.canonicalId, quantity: 2 })),
    );
    expect(validateFabPregameSelection(registered, selection).valid).toBe(true);
  });

  it("preserves a valid confirmed 60-card selection rather than adding its inventory on timeout", () => {
    const registered = pool([hammer]);
    const selected = {
      equipment: { weapon1: hammer.canonicalId },
      deck: deckCards.slice(0, 20).map((card) => ({ canonicalId: card.canonicalId, quantity: 3 })),
    };
    const result = reconcileFabPregameSelection(registered, selected);
    expect(result.selection).toEqual(selected);
    expect(result.validation.valid).toBe(true);
  });

  it("an invalid partial selection gets the complete automatic loadout", () => {
    const registered = pool([hammer, shield]);
    const result = reconcileFabPregameSelection(registered, {
      equipment: { weapon1: hammer.canonicalId, weapon2: shield.canonicalId },
      deck: [],
    });
    expect(result.validation.valid).toBe(true);
    expect(result.validation.deckCount).toBe(63);
    expect(result.selection.equipment.weapon1).toBe(hammer.canonicalId);
    expect(result.selection.equipment.weapon2).toBeUndefined();
    expect(result.selection.equipment.head).toBe(bodyCards[0]!.canonicalId);
  });
});
