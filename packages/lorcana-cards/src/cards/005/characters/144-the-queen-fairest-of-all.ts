import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenFairestOfAll: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1ho-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      id: "1ho-2",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      id: "1ho-3",
      text: "REFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.",
      type: "action",
    },
  ],
  cardNumber: 144,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
  cost: 5,
  externalIds: {
    ravensburger: "c18044cdeaee089bbfac4cac5d6c3aa8e04a92bd",
  },
  franchise: "Snow White",
  fullName: "The Queen - Fairest of All",
  id: "1ho",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Queen",
  set: "005",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named The Queen.)\nWard (Opponents can't choose this character except to challenge.)\nREFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.",
  version: "Fairest of All",
  willpower: 6,
};
