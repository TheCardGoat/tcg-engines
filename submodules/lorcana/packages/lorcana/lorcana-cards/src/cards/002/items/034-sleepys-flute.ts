import type { ItemCard } from "@tcg/lorcana-types";
import { sleepysFluteI18n } from "./034-sleepys-flute.i18n";

export const sleepysFlute: ItemCard = {
  id: "duq",
  canonicalId: "ci_duq",
  reprints: ["set2-034"],
  cardType: "item",
  name: "Sleepy's Flute",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  cardNumber: 34,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_341b56d7d2d549f5b2caa285c026278e",
    tcgPlayer: 527729,
  },
  text: [
    {
      title: "A SILLY SONG",
      description: "{E} — If you played a song this turn, gain 1 lore.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          comparison: {
            operator: "gte",
            value: 1,
          },
          metric: "played-songs",
          type: "turn-metric",
        },
        then: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
      },
      id: "1aa-1",
      name: "A SILLY SONG",
      text: "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.",
      type: "activated",
    },
  ],
  i18n: sleepysFluteI18n,
};
