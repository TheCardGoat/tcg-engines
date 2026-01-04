import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaUnstoppableForce: CharacterCard = {
  id: "jk9",
  cardType: "character",
  name: "Raya",
  version: "Unstoppable Force",
  fullName: "Raya - Unstoppable Force",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "Challenger +2 (While challenging, this character gets +2 {S}.)\nResist +2 (Damage dealt to this character is reduced by 2.)\nYOU GAVE IT YOUR BEST During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  cost: 7,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 193,
  inkable: true,
  externalIds: {
    ravensburger: "01f560e64dbad8d5d3b665a79d9438c1da824796",
  },
  abilities: [
    {
      id: "jk9-1",
      type: "keyword",
      keyword: "Challenger",
      value: 2,
    },
    {
      id: "jk9-2",
      type: "keyword",
      keyword: "Resist",
      value: 2,
    },
    {
      id: "jk9-3",
      name: "YOU GAVE IT YOUR BEST",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
