import type { CharacterCard } from "@tcg/lorcana-types";

export const wendyDarlingCourageousCaptain: CharacterCard = {
  abilities: [
    {
      id: "1dv-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "SELF",
      },
      id: "1dv-2",
      text: "LOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 108,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  cost: 2,
  externalIds: {
    ravensburger: "b3be12a2703c95466d26dd17ba82bd3145cfbfd8",
  },
  franchise: "Peter Pan",
  fullName: "Wendy Darling - Courageous Captain",
  id: "1dv",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Wendy Darling",
  set: "006",
  strength: 1,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nLOOK LIVELY, CREW! While you have another Pirate character in play, this character gets +1 {S} and +1 {L}.",
  version: "Courageous Captain",
  willpower: 2,
};
