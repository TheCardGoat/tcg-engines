import type { CharacterCard } from "@tcg/lorcana-types";

export const wendyDarlingAuthorityOnPeterPan: CharacterCard = {
  id: "st9",
  cardType: "character",
  name: "Wendy Darling",
  version: "Authority on Peter Pan",
  fullName: "Wendy Darling - Authority on Peter Pan",
  inkType: ["sapphire"],
  franchise: "Peter Pan",
  set: "003",
  text: "Ward (Opponents can't choose this character except to challenge.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  cardNumber: 158,
  inkable: true,
  externalIds: {
    ravensburger: "67d7ed9fa8bdaf3ad8fcd0dc75c6adf4de111738",
  },
  abilities: [
    {
      id: "st9-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "st9-2",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   supportAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const wendyDarlingAuthorityOnPeterPan: LorcanitoCharacterCard = {
//   id: "s1z",
//   name: "Wendy Darling",
//   title: "Authority on Peter Pan",
//   characteristics: ["hero", "storyborn"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [wardAbility, supportAbility],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 3,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Julie Vu",
//   number: 158,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 531826,
//   },
//   rarity: "super_rare",
// };
//
