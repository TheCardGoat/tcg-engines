import type { CharacterCard } from "@tcg/lorcana-types";
import { yaoSnowWarriorI18n } from "./073-yao-snow-warrior.i18n";

export const yaoSnowWarrior: CharacterCard = {
  id: "SFC",
  canonicalId: "ci_SFC",
  reprints: ["set11-073"],
  cardType: "character",
  name: "Yao",
  version: "Snow Warrior",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 73,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_85ee925c4b1c4c1bbf2d6320a9aeaf7d",
    tcgPlayer: 675387,
  },
  text: [
    {
      title: "OOH, I'M SCARED",
      description: "During opponents' turns, this character gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "18z-1",
      name: "OOH, I'M SCARED",
      type: "static",
      condition: {
        type: "during-turn",
        whose: "opponent",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
      text: "OOH, I'M SCARED During opponents' turns, this character gains Resist +2.",
    },
  ],
  i18n: yaoSnowWarriorI18n,
};
