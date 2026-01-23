import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckGhostFinder: CharacterCard = {
  id: "1m1",
  cardType: "character",
  name: "Daisy Duck",
  version: "Ghost Finder",
  fullName: "Daisy Duck - Ghost Finder",
  inkType: ["sapphire"],
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 141,
  inkable: true,
  externalIds: {
    ravensburger: "d3e63fe9f4bd72e82b947dcc61d0f2c1744b9221",
  },
  abilities: [
    {
      id: "1m1-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const daisyDuckGhostFinder: LorcanitoCharacterCard = {
//   id: "v0k",
//   name: "Daisy Duck",
//   title: "Ghost Finder",
//   characteristics: ["dreamborn", "hero", "detective"],
//   text: "Support",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "Alan Batson",
//   number: 141,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659764,
//   },
//   rarity: "common",
//   abilities: [supportAbility],
//   lore: 1,
// };
//
