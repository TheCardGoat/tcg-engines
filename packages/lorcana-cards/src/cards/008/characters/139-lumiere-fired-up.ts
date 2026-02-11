import type { CharacterCard } from "@tcg/lorcana-types";

export const lumiereFiredUp: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1k1-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "1k1-3",
      text: "SACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
      type: "action",
    },
  ],
  cardNumber: 139,
  cardType: "character",
  classifications: ["Floodborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "cd39c54678ac991587db8497726dcd78b478b748",
  },
  franchise: "Beauty and the Beast",
  fullName: "Lumiere - Fired Up",
  id: "1k1",
  inkType: ["ruby", "sapphire"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Lumiere",
  set: "008",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lumiere.)\nEvasive, Ward\nSACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
  version: "Fired Up",
  willpower: 3,
};
