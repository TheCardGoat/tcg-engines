import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelUnderhandedSchemer: CharacterCard = {
  id: "1au",
  cardType: "character",
  name: "Mother Gothel",
  version: "Underhanded Schemer",
  fullName: "Mother Gothel - Underhanded Schemer",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "010",
  text: "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 110,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a8d28560d4ed027183aa8139f310bd1579b03f24",
  },
  abilities: [
    {
      id: "1au-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "a character was banished this turn",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 2,
          target: "SELF",
        },
      },
      text: "SOMEBODY'S GOT TO USE IT If a character was banished this turn, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
