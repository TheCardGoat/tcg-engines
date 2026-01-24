import type { CharacterCard } from "@tcg/lorcana-types";

export const ramaVigilantFather: CharacterCard = {
  id: "1d1",
  cardType: "character",
  name: "Rama",
  version: "Vigilant Father",
  fullName: "Rama - Vigilant Father",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "010",
  text: "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
  cost: 6,
  strength: 6,
  willpower: 6,
  lore: 2,
  cardNumber: 109,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b0cb45307725aa8afa6fc53b41b723d92b4a6c0a",
  },
  abilities: [
    {
      id: "1d1-1",
      type: "triggered",
      name: "PROTECTION OF THE PACK",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            effect: {
              type: "ready",
              target: {
                selector: "self",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            chooser: "CONTROLLER",
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
      text: "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
