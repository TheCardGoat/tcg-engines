import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanFreeSpirit: CharacterCard = {
  id: "roa",
  cardType: "character",
  name: "Mulan",
  version: "Free Spirit",
  fullName: "Mulan - Free Spirit",
  inkType: ["amber"],
  franchise: "Mulan",
  set: "009",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 10,
  inkable: true,
  externalIds: {
    ravensburger: "63be0c9e418d5a0329a87de4082802d18848efe6",
  },
  abilities: [
    {
      id: "roa-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { mulanFreeSpirit as ogMulanFreeSpirit } from "@lorcanito/lorcana-engine/cards/002/characters/015-mulan-free-spirit";
//
// export const mulanFreeSpirit: LorcanitoCharacterCard = {
//   ...ogMulanFreeSpirit,
//   id: "efk",
//   reprints: [ogMulanFreeSpirit.id],
//   number: 10,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649959,
//   },
// };
//
