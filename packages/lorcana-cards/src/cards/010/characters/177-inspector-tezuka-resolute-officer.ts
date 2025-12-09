import type { CharacterCard } from "@tcg/lorcana";

export const inspectorTezukaResoluteOfficer: CharacterCard = {
  id: "15o",
  cardType: "character",
  name: "Inspector Tezuka",
  version: "Resolute Officer",
  fullName: "Inspector Tezuka - Resolute Officer",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  externalIds: {
    ravensburger: "9644b567eec1691484deb7950ab8728fb6fdc9a8",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "15o-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
};
