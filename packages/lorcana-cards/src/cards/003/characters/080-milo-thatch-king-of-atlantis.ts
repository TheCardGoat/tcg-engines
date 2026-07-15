import type { CharacterCard } from "@tcg/lorcana-types";

export const miloThatchKingOfAtlantis: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "r1c-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
  ],
  cardNumber: 80,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "King"],
  cost: 7,
  externalIds: {
    ravensburger: "6171faef1161c353aae832650702ac027410eea5",
  },
  franchise: "Atlantis",
  fullName: "Milo Thatch - King of Atlantis",
  id: "r1c",
  inkType: ["emerald"],
  inkable: false,
  lore: 3,
  missingImplementation: true,
  missingTests: true,
  name: "Milo Thatch",
  set: "003",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Milo Thatch.)\nTAKE THEM BY SURPRISE When this character is banished, return all opposing characters to their players' hands.",
  version: "King of Atlantis",
  willpower: 4,
};
