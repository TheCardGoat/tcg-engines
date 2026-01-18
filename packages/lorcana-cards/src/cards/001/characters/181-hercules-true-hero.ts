import type { CharacterCard } from "@tcg/lorcana-types";
import { bodyguard } from "../../ability-helpers";

export const herculesTrueHero: CharacterCard = {
  id: "uyj",
  cardType: "character",
  name: "Hercules",
  version: "True Hero",
  fullName: "Hercules - True Hero",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [bodyguard("uyj-1")],
  classifications: ["Hero", "Dreamborn", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const herculesTrueHero: LorcanitoCharacterCard = {
//   id: "uyj",
//   reprints: ["s5k"],
//
//   name: "Hercules",
//   title: "True Hero",
//   characteristics: ["hero", "dreamborn", "prince"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "character",
//   abilities: [bodyguardAbility],
//   flavour: "„You gotta admit, that was pretty heroic.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Marcel Berg",
//   number: 181,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492716,
//   },
//   rarity: "common",
// };
//
