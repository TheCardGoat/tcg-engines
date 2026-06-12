import type { CharacterCard } from "@tcg/lorcana-types";
import { mushuMajesticDragonI18n } from "./137-mushu-majestic-dragon.i18n";

export const mushuMajesticDragon: CharacterCard = {
  id: "8nj",
  canonicalId: "ci_8nj",
  reprints: ["set7-137"],
  cardType: "character",
  name: "Mushu",
  version: "Majestic Dragon",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 137,
  rarity: "rare",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c58452a39084f28b379fdd1133ffdea",
    tcgPlayer: 619482,
  },
  text: [
    {
      title: "INTIMIDATING AND AWE-INSPIRING",
      description:
        "Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
    },
    {
      title: "GUARDIAN OF LOST SOULS",
      description:
        "During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Dragon"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: { ref: "trigger-subject" },
        type: "gain-keyword",
        value: 2,
        duration: "during-challenge",
      },
      id: "bra-1",
      name: "INTIMIDATING AND AWE-INSPIRING",
      text: "INTIMIDATING AND AWE-INSPIRING Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
      trigger: {
        event: "challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
    {
      effect: {
        amount: 2,
        target: "CONTROLLER",
        type: "gain-lore",
      },
      id: "bra-2",
      name: "GUARDIAN OF LOST SOULS",
      text: "GUARDIAN OF LOST SOULS During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      type: "triggered",
    },
  ],
  i18n: mushuMajesticDragonI18n,
};
