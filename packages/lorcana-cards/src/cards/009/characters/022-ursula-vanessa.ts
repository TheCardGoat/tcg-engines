import type { CharacterCard } from "@tcg/lorcana";

export const ursulaVanessa: CharacterCard = {
  id: "lsj",
  cardType: "character",
  name: "Ursula",
  version: "Vanessa",
  fullName: "Ursula - Vanessa",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "009",
  text: "Singer 4 (This character counts as cost 4 to sing songs.)",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 22,
  inkable: true,
  externalIds: {
    ravensburger: "4e8aaca4272863b70bf21a78240c97ccad2e3ce5",
  },
  abilities: [
    {
      id: "lsj-1",
      text: "Singer 4",
      type: "keyword",
      keyword: "Singer",
      value: 4,
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
