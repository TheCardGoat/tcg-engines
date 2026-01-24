import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonSchemingSuitor: CharacterCard = {
  id: "1xf",
  cardType: "character",
  name: "Gaston",
  version: "Scheming Suitor",
  fullName: "Gaston - Scheming Suitor",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 83,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fa46cb5d8c91e28cee54f0e6fc320dba20035c8e",
  },
  abilities: [
    {
      id: "1xf-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
      text: "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
