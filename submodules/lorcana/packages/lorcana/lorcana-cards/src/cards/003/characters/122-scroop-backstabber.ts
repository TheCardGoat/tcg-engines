import type { CharacterCard } from "@tcg/lorcana-types";
import { scroopBackstabberI18n } from "./122-scroop-backstabber.i18n";

export const scroopBackstabber: CharacterCard = {
  id: "2ti",
  canonicalId: "ci_2ti",
  reprints: ["set3-122"],
  cardType: "character",
  name: "Scroop",
  version: "Backstabber",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 122,
  rarity: "uncommon",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d785c3ffe80440a5a9ef39641add4d23",
    tcgPlayer: 537610,
  },
  text: [
    {
      title: "BRUTE",
      description: "While this character has damage, he gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate"],
  abilities: [
    {
      condition: {
        type: "self-has-damage",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "58w-1",
      name: "BRUTE",
      text: "BRUTE While this character has damage, he gets +3 {S}.",
      type: "static",
    },
  ],
  i18n: scroopBackstabberI18n,
};
