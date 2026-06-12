import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimTrulyMarvelousI18n } from "./055-madam-mim-truly-marvelous.i18n";

export const madamMimTrulyMarvelous: CharacterCard = {
  id: "I6q",
  canonicalId: "ci_I6q",
  reprints: ["set6-055"],
  cardType: "character",
  name: "Madam Mim",
  version: "Truly Marvelous",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "006",
  cardNumber: 55,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_997d20bbd2204f4a8cd9670598d8405c",
    tcgPlayer: 587972,
  },
  text: [
    {
      title: "OH, BAT GIZZARDS 2",
      description: "{I}, Choose and discard a card — Gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "182-1",
      name: "OH, BAT GIZZARDS 2",
      type: "activated",
      cost: {
        ink: 2,
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.",
    },
  ],
  i18n: madamMimTrulyMarvelousI18n,
};
