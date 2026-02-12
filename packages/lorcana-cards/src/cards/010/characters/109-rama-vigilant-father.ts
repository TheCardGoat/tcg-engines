import type { CharacterCard } from "@tcg/lorcana-types";

export const ramaVigilantFather: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "sequence",
      },
      id: "1d1-1",
      name: "PROTECTION OF THE PACK",
      text: "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 109,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "b0cb45307725aa8afa6fc53b41b723d92b4a6c0a",
  },
  franchise: "Jungle Book",
  fullName: "Rama - Vigilant Father",
  id: "1d1",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Rama",
  set: "010",
  strength: 6,
  text: "PROTECTION OF THE PACK Whenever you play another character with 5 {S} or more, you may ready this character. If you do, he can't quest for the rest of this turn.",
  version: "Vigilant Father",
  willpower: 6,
};
