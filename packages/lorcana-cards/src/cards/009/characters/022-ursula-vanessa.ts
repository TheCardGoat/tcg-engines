import type { CharacterCard } from "@tcg/lorcana-types";

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
      type: "keyword",
      keyword: "Singer",
      value: 4,
      text: "Singer 4",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ursulaVanessa as ogUrsulaVanessa } from "@lorcanito/lorcana-engine/cards/004/characters/25-ursula-vanessa";
//
// export const ursulaVanessa: LorcanitoCharacterCard = {
//   ...ogUrsulaVanessa,
//   id: "iye",
//   reprints: [ogUrsulaVanessa.id],
//   number: 22,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649970,
//   },
// };
//
