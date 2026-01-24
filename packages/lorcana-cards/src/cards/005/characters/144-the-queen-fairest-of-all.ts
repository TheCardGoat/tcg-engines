import type { CharacterCard } from "@tcg/lorcana-types";

export const theQueenFairestOfAll: CharacterCard = {
  id: "1ho",
  cardType: "character",
  name: "The Queen",
  version: "Fairest of All",
  fullName: "The Queen - Fairest of All",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named The Queen.)\nWard (Opponents can't choose this character except to challenge.)\nREFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  cardNumber: 144,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c18044cdeaee089bbfac4cac5d6c3aa8e04a92bd",
  },
  abilities: [
    {
      id: "1ho-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "1ho-2",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "1ho-3",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "REFLECTIONS OF VANITY For each other character named The Queen you have in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Floodborn", "Villain", "Queen", "Sorcerer"],
};
