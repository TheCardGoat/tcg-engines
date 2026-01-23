import type { CharacterCard } from "@tcg/lorcana-types";

export const ticktockEverpresentPursuer: CharacterCard = {
  id: "16h",
  cardType: "character",
  name: "Tick-Tock",
  version: "Ever-Present Pursuer",
  fullName: "Tick-Tock - Ever-Present Pursuer",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 6,
  strength: 4,
  willpower: 7,
  lore: 1,
  cardNumber: 50,
  inkable: true,
  externalIds: {
    ravensburger: "99133bb34b1ce309fdf855a65f0cd70f9a17cc59",
  },
  abilities: [
    {
      id: "16h-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { ticktockEverpresentPursuer as ogTickTockEverPresentPursuer } from "@lorcanito/lorcana-engine/cards/004/characters/056-tick-tock-ever-present-pursuer";
//
// export const ticktockEverpresentPursuer: LorcanitoCharacterCard = {
//   ...ogTickTockEverPresentPursuer,
//   id: "znh",
//   reprints: [ogTickTockEverPresentPursuer.id],
//   number: 50,
//   set: "009",
//   externalIds: {
//     tcgPlayer: 649994,
//   },
// };
//
