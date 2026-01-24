import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaPrideProtector: CharacterCard = {
  id: "1i7",
  cardType: "character",
  name: "Simba",
  version: "Pride Protector",
  fullName: "Simba - Pride Protector",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "006",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)\nUNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 20,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c369e5aa59fe458f7582aac34a9bce42be0eb6e6",
  },
  abilities: [
    {
      id: "1i7-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "1i7-2",
      type: "action",
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
      text: "UNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
