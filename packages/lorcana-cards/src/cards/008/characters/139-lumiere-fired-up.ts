import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereFiredUp: CharacterCard = {
  id: "1k1",
  cardType: "character",
  name: "Lumiere",
  version: "Fired Up",
  fullName: "Lumiere - Fired Up",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)\nEvasive, Ward\nSACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 139,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cd39c54678ac991587db8497726dcd78b478b748",
  },
  abilities: [
    {
      id: "1k1-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "1k1-3",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      text: "SACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
};
