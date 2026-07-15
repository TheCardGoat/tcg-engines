import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaUnstoppableForce: CharacterCard = {
  abilities: [
    {
      id: "jk9-1",
      keyword: "Challenger",
      text: "Challenger +2",
      type: "keyword",
      value: 2,
    },
    {
      id: "jk9-2",
      keyword: "Resist",
      text: "Resist +2",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "jk9-3",
      name: "YOU GAVE IT YOUR BEST",
      text: "YOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 7,
  externalIds: {
    ravensburger: "01f560e64dbad8d5d3b665a79d9438c1da824796",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Raya - Unstoppable Force",
  id: "jk9",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Raya",
  set: "004",
  strength: 3,
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nYOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  version: "Unstoppable Force",
  willpower: 6,
};
