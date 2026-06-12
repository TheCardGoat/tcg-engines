import type { CharacterCard } from "@tcg/lorcana-types";
import { queenOfHeartsLosingHerTemperI18n } from "./122-queen-of-hearts-losing-her-temper.i18n";

export const queenOfHeartsLosingHerTemper: CharacterCard = {
  id: "Fnw",
  canonicalId: "ci_Fnw",
  reprints: ["set7-122"],
  cardType: "character",
  name: "Queen of Hearts",
  version: "Losing Her Temper",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  cardNumber: 122,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8e76340248ad450587db93be8aeeb437",
    tcgPlayer: 619473,
  },
  text: [
    {
      title: "ROYAL PAIN",
      description: "While this character has damage, she gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen"],
  abilities: [
    {
      condition: {
        type: "has-any-damage",
      },
      effect: {
        modifier: 3,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "123-1",
      name: "ROYAL PAIN",
      text: "ROYAL PAIN While this character has damage, she gets +3 {S}.",
      type: "static",
    },
  ],
  i18n: queenOfHeartsLosingHerTemperI18n,
};
