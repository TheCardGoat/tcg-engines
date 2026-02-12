import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaTeamLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      id: "1yr-1",
      name: "I NEED TO UPGRADE ALL OF YOU Your other Inventor",
      text: "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1.",
      type: "static",
    },
    {
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "put-on-bottom",
      },
      id: "1yr-2",
      text: "SHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
      type: "action",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "ff11309d766c3ab5b5c66c8ce13f398571351161",
  },
  franchise: "Big Hero 6",
  fullName: "Hiro Hamada - Team Leader",
  id: "1yr",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Hiro Hamada",
  set: "006",
  strength: 1,
  text: "I NEED TO UPGRADE ALL OF YOU Your other Inventor characters gain Resist +1. (Damage dealt to them is reduced by 1.)\n\nSHAPE THE FUTURE 2 {I} - Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  version: "Team Leader",
  willpower: 5,
};
