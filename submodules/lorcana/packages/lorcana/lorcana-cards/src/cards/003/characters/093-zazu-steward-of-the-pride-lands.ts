import type { CharacterCard } from "@tcg/lorcana-types";
import { zazuStewardOfThePrideLandsI18n } from "./093-zazu-steward-of-the-pride-lands.i18n";

export const zazuStewardOfThePrideLands: CharacterCard = {
  id: "13r",
  canonicalId: "ci_13r",
  reprints: ["set3-093"],
  cardType: "character",
  name: "Zazu",
  version: "Steward of the Pride Lands",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 93,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ad676278d4e74481af58729c5c986b7b",
    tcgPlayer: 539084,
  },
  text: [
    {
      title: "IT'S TIME TO GO!",
      description: "While this character is at a location, he gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "at-location",
      },
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "18g-1",
      name: "IT'S TIME TO GO!",
      text: "IT'S TIME TO GO! While this character is at a location, he gets +1 {L}.",
      type: "static",
    },
  ],
  i18n: zazuStewardOfThePrideLandsI18n,
};
