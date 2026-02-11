import type { CharacterCard } from "@tcg/lorcana-types";

export const luisaMadrigalRockOfTheFamily: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "10a-1",
      text: "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 184,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 3,
  externalIds: {
    ravensburger: "82cce795ee075eb98b612b69862d2f8c19ca368b",
  },
  franchise: "Encanto",
  fullName: "Luisa Madrigal - Rock of the Family",
  id: "10a",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Luisa Madrigal",
  set: "004",
  strength: 2,
  text: "I'M THE STRONG ONE While you have another character in play, this character gets +2 {S}.",
  version: "Rock of the Family",
  willpower: 4,
};
