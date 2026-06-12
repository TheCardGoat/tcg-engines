import type { CharacterCard } from "@tcg/lorcana-types";
import { peteBornToCheatI18n } from "./085-pete-born-to-cheat.i18n";

export const peteBornToCheat: CharacterCard = {
  id: "NSZ",
  canonicalId: "ci_NSZ",
  reprints: ["set4-085"],
  cardType: "character",
  name: "Pete",
  version: "Born to Cheat",
  inkType: ["emerald"],
  set: "004",
  cardNumber: 85,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_07556ab263e64b3e816e9b094893b497",
    tcgPlayer: 550580,
  },
  text: [
    {
      title: "I CLOBBER YOU!",
      description:
        "Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Musketeer"],
  abilities: [
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "less-or-equal",
              value: 2,
            },
          ],
        },
        type: "return-to-hand",
      },
      id: "d6v-1",
      name: "I CLOBBER YOU!",
      text: "I CLOBBER YOU! Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
        condition: {
          type: "stat-threshold",
          stat: "strength",
          value: 5,
          comparison: "greater-or-equal",
          target: "SELF",
        },
      },
      type: "triggered",
    },
  ],
  i18n: peteBornToCheatI18n,
};
