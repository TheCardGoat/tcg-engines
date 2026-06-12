import type { CharacterCard } from "@tcg/lorcana-types";
import { lingSnowWarriorI18n } from "./075-ling-snow-warrior.i18n";

export const lingSnowWarrior: CharacterCard = {
  id: "09Z",
  canonicalId: "ci_09Z",
  reprints: ["set11-075"],
  cardType: "character",
  name: "Ling",
  version: "Snow Warrior",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 75,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_00eb4b66a7f945adaa15ca341179bbf7",
    tcgPlayer: 675389,
  },
  text: [
    {
      title: "BUILDING MUSCLES 1",
      description: "{I} — Chosen character gets +1 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "bl8-1",
      cost: {
        ink: 1,
      },
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "modify-stat",
        duration: "this-turn",
      },
      type: "activated",
      text: "BUILDING MUSCLES 1 {I} — Chosen character gets +1 {S} this turn.",
    },
  ],
  i18n: lingSnowWarriorI18n,
};
