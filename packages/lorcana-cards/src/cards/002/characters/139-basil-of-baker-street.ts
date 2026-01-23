import type { CharacterCard } from "@tcg/lorcana-types";

export const basilOfBakerStreet: CharacterCard = {
  id: "1xt",
  cardType: "character",
  name: "Basil",
  version: "Of Baker Street",
  fullName: "Basil - Of Baker Street",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 139,
  inkable: true,
  externalIds: {
    ravensburger: "fba07c9e309578673beb0679dd654ab701fc31bb",
  },
  abilities: [
    {
      id: "1xt-1",
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
// export const basilOfBakerStreet: LorcanitoCharacterCard = {
//   id: "ne2",
//
//   name: "Basil",
//   title: "Of Baker Street",
//   characteristics: ["hero", "dreamborn", "detective"],
//   text: "**Support** _(Whenever this character quests, you\u0003 may add their {S} to another chosen character‘s {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   flavour:
//     "What an ingenious device! If its light is refracted through these, then its images must resolve somewhere below.",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Jake Parker",
//   number: 139,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 525239,
//   },
//   rarity: "common",
// };
//
