import type { CharacterCard } from "@tcg/lorcana-types";

export const kakamoraBandOfPirates: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "SELF",
        value: 3,
      },
      id: "15r-1",
      text: "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3.",
      type: "action",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Storyborn", "Pirate"],
  cost: 4,
  externalIds: {
    ravensburger: "968fb5547e711a20578bb568ded5ae7b8bffbf73",
  },
  franchise: "Moana",
  fullName: "Kakamora - Band of Pirates",
  id: "15r",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Kakamora",
  set: "007",
  strength: 1,
  text: "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3. (While challenging, this character gets +3 {S}.)",
  version: "Band of Pirates",
  willpower: 6,
};
