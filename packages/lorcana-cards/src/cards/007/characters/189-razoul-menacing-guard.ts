import type { CharacterCard } from "@tcg/lorcana-types";

export const razoulMenacingGuard: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "1gi-1",
      name: "MY ORDERS COME FROM JAFAR",
      text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 189,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Captain"],
  cost: 2,
  externalIds: {
    ravensburger: "bd4556b415c9d59ebf5ce6f7e363998afd05e091",
  },
  franchise: "Aladdin",
  fullName: "Razoul - Menacing Guard",
  id: "1gi",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Razoul",
  set: "007",
  strength: 1,
  text: "MY ORDERS COME FROM JAFAR When you play this character, if you have a character named Jafar in play, you may banish chosen item.",
  version: "Menacing Guard",
  willpower: 3,
};
