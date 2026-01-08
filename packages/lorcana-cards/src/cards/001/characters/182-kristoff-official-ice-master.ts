import type { CharacterCard } from "@tcg/lorcana-types";

export const kristoffOfficialIceMaster: CharacterCard = {
  id: "1pd",
  cardType: "character",
  name: "Kristoff",
  version: "Official Ice Master",
  fullName: "Kristoff - Official Ice Master",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "001",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 182,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "dcc435a4545c40e6dfe713fe317f78e418982a15",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const kristoff: LorcanitoCharacterCard = {
//   id: "gpq",
//
//   name: "Kristoff",
//   title: "Official Ice Master",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour:
//     'Kristoff: "You want to talk about a supply and demand problem? I sell ice for a living."<br /> Anna: "Ooh, that\'s a rough business to be in right now. I mean, that is really - ah, mm. That\'s unfortunate."',
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Ron Baird",
//   number: 182,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492998,
//   },
//   rarity: "common",
// };
//
