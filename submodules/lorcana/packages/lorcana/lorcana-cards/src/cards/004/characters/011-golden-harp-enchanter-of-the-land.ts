import type { CharacterCard } from "@tcg/lorcana-types";
import { goldenHarpEnchanterOfTheLandI18n } from "./011-golden-harp-enchanter-of-the-land.i18n";

export const goldenHarpEnchanterOfTheLand: CharacterCard = {
  id: "KkZ",
  canonicalId: "ci_KkZ",
  reprints: ["set4-011"],
  cardType: "character",
  name: "Golden Harp",
  version: "Enchanter of the Land",
  inkType: ["amber"],
  set: "004",
  cardNumber: 11,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_4047afdc24734dc081571f81815febd8",
    tcgPlayer: 549623,
  },
  text: [
    {
      title: "STOLEN AWAY",
      description:
        "At the end of your turn, if you didn't play a song this turn, banish this character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      name: "STOLEN AWAY",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "turn-metric",
        metric: "played-songs",
        comparison: {
          operator: "eq",
          value: 0,
        },
      },
      effect: {
        target: "SELF",
        type: "banish",
      },
      id: "1vy-1",
      text: "STOLEN AWAY At the end of your turn, if you didn't play a song this turn, banish this character.",
      type: "triggered",
    },
  ],
  i18n: goldenHarpEnchanterOfTheLandI18n,
};
