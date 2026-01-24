import type { CharacterCard } from "@tcg/lorcana-types";

export const princeCharmingProtectorOfTheRealm: CharacterCard = {
  id: "1i3",
  cardType: "character",
  name: "Prince Charming",
  version: "Protector of the Realm",
  fullName: "Prince Charming - Protector of the Realm",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nPROTECTIVE PRESENCE Each turn, only one character can challenge.",
  cost: 7,
  strength: 3,
  willpower: 10,
  lore: 2,
  cardNumber: 189,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c2fc2ba233e86f60234670abac3a03817f461557",
  },
  abilities: [
    {
      id: "1i3-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Prince"],
};
