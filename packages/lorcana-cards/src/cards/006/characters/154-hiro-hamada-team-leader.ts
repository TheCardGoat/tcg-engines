import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaTeamLeader: CharacterCard = {
  id: "1yr",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Team Leader",
  fullName: "Hiro Hamada - Team Leader",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1. (Damage dealt to them is reduced by 1.)\n\nSHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 4,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 154,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff11309d766c3ab5b5c66c8ce13f398571351161",
  },
  abilities: [
    {
      id: "1yr-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        value: 1,
      },
      name: "I NEED TO UPGRADE ALL OF YOU Your other Inventor",
      text: "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1.",
    },
    {
      id: "1yr-2",
      type: "action",
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      text: "SHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
