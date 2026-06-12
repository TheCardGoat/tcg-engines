import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaUnstoppableForceI18n } from "./193-raya-unstoppable-force.i18n";
import { challenger } from "../../../helpers/abilities/challenger";
import { resist } from "../../../helpers/abilities/resist";

export const rayaUnstoppableForce: CharacterCard = {
  id: "u57",
  canonicalId: "ci_u57",
  reprints: ["set4-193"],
  cardType: "character",
  name: "Raya",
  version: "Unstoppable Force",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  cardNumber: 193,
  rarity: "common",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_498044d6e5da4eb3868df6a6d0c058d4",
    tcgPlayer: 550621,
  },
  text: [
    {
      title: "Challenger +2",
    },
    {
      title: "Resist +2",
    },
    {
      title: "YOU GAVE IT YOUR BEST",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    challenger(2),
    resist(2),
    {
      id: "jk9-3",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "YOU GAVE IT YOUR BEST",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      type: "triggered",
      text: "YOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    },
  ],
  i18n: rayaUnstoppableForceI18n,
};
