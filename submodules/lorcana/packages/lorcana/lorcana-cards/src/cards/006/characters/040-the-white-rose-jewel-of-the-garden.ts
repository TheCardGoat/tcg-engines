import type { CharacterCard } from "@tcg/lorcana-types";
import { theWhiteRoseJewelOfTheGardenI18n } from "./040-the-white-rose-jewel-of-the-garden.i18n";

export const theWhiteRoseJewelOfTheGarden: CharacterCard = {
  id: "ZnW",
  canonicalId: "ci_ZnW",
  reprints: ["set6-040"],
  cardType: "character",
  name: "The White Rose",
  version: "Jewel of the Garden",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  cardNumber: 40,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6fbd9103624b4b8d95fec133326385c7",
    tcgPlayer: 593043,
  },
  text: [
    {
      title: "THE BEAUTY OF THE WORLD",
      description: "When you play this character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1v8-1",
      name: "THE BEAUTY OF THE WORLD",
      text: "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: theWhiteRoseJewelOfTheGardenI18n,
};
