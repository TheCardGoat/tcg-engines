import type { CharacterCard } from "@tcg/lorcana-types";

export const dawsonPuzzlingSleuth: CharacterCard = {
  id: "1t5",
  cardType: "character",
  name: "Dawson",
  version: "Puzzling Sleuth",
  fullName: "Dawson - Puzzling Sleuth",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "007",
  text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 161,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "eadc583df968a52341c644cac11cd8aecd7804e2",
  },
  abilities: [
    {
      id: "1t5-1",
      type: "triggered",
      name: "BE SENSIBLE Once",
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
};
