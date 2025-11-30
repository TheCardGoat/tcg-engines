import type { CharacterCard } from "@tcg/lorcana";

export const gazellePopStar: CharacterCard = {
  id: "g80",
  cardType: "character",
  name: "Gazelle",
  version: "Pop Star",
  fullName: "Gazelle - Pop Star",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "005",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)",
  cardNumber: "011",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "3a77973047a9e2dc5748299006ede3868e00d061",
  },
  keywords: [
    {
      type: "Singer",
      value: 5,
    },
  ],
  abilities: [
    {
      id: "g80-ability-1",
      text: "Singer 5 (This character counts as cost 5 to sing songs.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
