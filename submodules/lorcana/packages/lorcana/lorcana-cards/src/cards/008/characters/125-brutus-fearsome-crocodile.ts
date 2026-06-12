import type { CharacterCard } from "@tcg/lorcana-types";
import { brutusFearsomeCrocodileI18n } from "./125-brutus-fearsome-crocodile.i18n";

export const brutusFearsomeCrocodile: CharacterCard = {
  id: "ZmK",
  canonicalId: "ci_ZmK",
  reprints: ["set8-125"],
  cardType: "character",
  name: "Brutus",
  version: "Fearsome Crocodile",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "008",
  cardNumber: 125,
  rarity: "common",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_413aa60d7950479282acb68e97eaafcd",
    tcgPlayer: 633431,
  },
  text: [
    {
      title: "SPITEFUL",
      description:
        "During your turn, when this character is banished, if one of your characters took damage this turn, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "turn-metric",
        metric: "damaged-characters-by-owner",
        ownerScope: "you",
        comparison: {
          operator: "gt",
          value: 0,
        },
      },
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "j0c-1",
      name: "SPITEFUL",
      text: "SPITEFUL During your turn, when this character is banished, if one of your characters took damage this turn, gain 2 lore.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: brutusFearsomeCrocodileI18n,
};
