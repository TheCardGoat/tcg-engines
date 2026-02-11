import type { CharacterCard } from "@tcg/lorcana-types";

export const gastonSchemingSuitor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
      id: "1xf-1",
      text: "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.",
      type: "action",
    },
  ],
  cardNumber: 83,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 2,
  externalIds: {
    ravensburger: "fa46cb5d8c91e28cee54f0e6fc320dba20035c8e",
  },
  franchise: "Beauty and the Beast",
  fullName: "Gaston - Scheming Suitor",
  id: "1xf",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gaston",
  set: "002",
  strength: 1,
  text: "YES, I'M INTIMIDATING While one or more opponents have no cards in their hands, this character gets +3 {S}.",
  version: "Scheming Suitor",
  willpower: 3,
};
