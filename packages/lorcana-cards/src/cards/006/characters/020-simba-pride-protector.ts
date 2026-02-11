import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaPrideProtector: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1i7-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "ready",
          target: {
            selector: "all",
            count: "all",
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "1i7-2",
      text: "UNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
      type: "action",
    },
  ],
  cardNumber: 20,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "c369e5aa59fe458f7582aac34a9bce42be0eb6e6",
  },
  franchise: "Lion King",
  fullName: "Simba - Pride Protector",
  id: "1i7",
  inkType: ["amber"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Simba",
  set: "006",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
  version: "Pride Protector",
  willpower: 4,
};
