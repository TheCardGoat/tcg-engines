import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaKumandranRider: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          duration: "this-turn",
          restriction: "cant-quest",
          target: "SELF",
          type: "restriction",
        },
        type: "optional",
      },
      id: "1dx-1",
      text: "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 107,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "b3e92dc9fec7a75e1e43f9771888ad399934f8f7",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Raya - Kumandran Rider",
  id: "1dx",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Raya",
  set: "006",
  strength: 3,
  text: "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
  version: "Kumandran Rider",
  willpower: 3,
};
