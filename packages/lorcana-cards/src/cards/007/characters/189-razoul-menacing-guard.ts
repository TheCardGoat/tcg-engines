import type { CharacterCard } from "@tcg/lorcana-types";

export const razoulMenacingGuard: CharacterCard = {
  id: "1gi",
  cardType: "character",
  name: "Razoul",
  version: "Menacing Guard",
  fullName: "Razoul - Menacing Guard",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "007",
  text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 189,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd4556b415c9d59ebf5ce6f7e363998afd05e091",
  },
  abilities: [
    {
      id: "1gi-1",
      type: "triggered",
      name: "MY ORDERS COME FROM JAFAR",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Captain"],
};
