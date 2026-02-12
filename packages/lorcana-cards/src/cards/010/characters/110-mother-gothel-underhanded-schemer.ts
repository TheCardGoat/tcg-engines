import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelUnderhandedSchemer: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "a character was banished this turn",
          type: "if",
        },
        then: {
          modifier: 2,
          stat: "strength",
          target: "SELF",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "1au-1",
      text: "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 110,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 1,
  externalIds: {
    ravensburger: "a8d28560d4ed027183aa8139f310bd1579b03f24",
  },
  franchise: "Tangled",
  fullName: "Mother Gothel - Underhanded Schemer",
  id: "1au",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mother Gothel",
  set: "010",
  strength: 2,
  text: "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.",
  version: "Underhanded Schemer",
  willpower: 1,
};
