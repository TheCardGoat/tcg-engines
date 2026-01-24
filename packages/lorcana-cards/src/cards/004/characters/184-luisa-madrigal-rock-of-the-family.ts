import type { CharacterCard } from "@tcg/lorcana-types";

export const luisaMadrigalRockOfTheFamily: CharacterCard = {
  id: "10a",
  cardType: "character",
  name: "Luisa Madrigal",
  version: "Rock of the Family",
  fullName: "Luisa Madrigal - Rock of the Family",
  inkType: ["steel"],
  franchise: "Encanto",
  set: "004",
  text: "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 184,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "82cce795ee075eb98b612b69862d2f8c19ca368b",
  },
  abilities: [
    {
      id: "10a-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
