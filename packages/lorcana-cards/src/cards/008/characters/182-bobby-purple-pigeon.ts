import type { CharacterCard } from "@tcg/lorcana";

export const bobbyPurplePigeon: CharacterCard = {
  id: "mbj",
  cardType: "character",
  name: "Bobby",
  version: "Purple Pigeon",
  fullName: "Bobby - Purple Pigeon",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "182",
  cost: 3,
  strength: 4,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "5071a3a017156ec252d3ef037f0e3fb1fd212f87",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "mbj-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
  ],
  classifications: ["Storyborn"],
};
