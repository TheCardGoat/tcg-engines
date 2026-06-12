import type { CharacterCard } from "@tcg/lorcana-types";
import { panicUnderworldImpI18n } from "./087-panic-underworld-imp.i18n";

export const panicUnderworldImp: CharacterCard = {
  id: "Ixv",
  canonicalId: "ci_Ixv",
  reprints: ["set2-087"],
  cardType: "character",
  name: "Panic",
  version: "Underworld Imp",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "002",
  cardNumber: 87,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_995ce4bea35048d3b53f224ba4fc7664",
    tcgPlayer: 519492,
  },
  text: [
    {
      title: "I CAN HANDLE IT",
      description:
        "When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        condition: {
          type: "is-named",
          name: "Pain",
        },
        then: {
          duration: "this-turn",
          modifier: 4,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        else: {
          duration: "this-turn",
          modifier: 2,
          stat: "strength",
          target: "CHOSEN_CHARACTER",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "1yg-1",
      name: "I CAN HANDLE IT",
      text: "I CAN HANDLE IT When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: panicUnderworldImpI18n,
};
