import type { CharacterCard } from "@tcg/lorcana-types";

export const dawsonPuzzlingSleuth: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "1t5-1",
      name: "BE SENSIBLE Once",
      text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 161,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Detective"],
  cost: 1,
  externalIds: {
    ravensburger: "eadc583df968a52341c644cac11cd8aecd7804e2",
  },
  franchise: "Great Mouse Detective",
  fullName: "Dawson - Puzzling Sleuth",
  id: "1t5",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Dawson",
  set: "007",
  strength: 1,
  text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
  version: "Puzzling Sleuth",
  willpower: 2,
};
