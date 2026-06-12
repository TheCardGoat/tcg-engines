import type { CharacterCard } from "@tcg/lorcana-types";
import { powerlineMusicalSuperstarI18n } from "./117-powerline-musical-superstar.i18n";

export const powerlineMusicalSuperstar: CharacterCard = {
  id: "Xee",
  canonicalId: "ci_JGr",
  reprints: ["set9-117"],
  cardType: "character",
  name: "Powerline",
  version: "Musical Superstar",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 117,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e234293cec8f422eb1d613594771e5ee",
    tcgPlayer: 650151,
  },
  text: [
    {
      title: "ELECTRIC MOVE",
      description:
        "If you've played a song this turn, this character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      condition: {
        type: "turn-metric",
        metric: "played-songs",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        keyword: "Rush",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "yez-1",
      name: "ELECTRIC MOVE",
      text: "ELECTRIC MOVE If you've played a song this turn, this character gains Rush this turn.",
      type: "static",
    },
  ],
  i18n: powerlineMusicalSuperstarI18n,
};
