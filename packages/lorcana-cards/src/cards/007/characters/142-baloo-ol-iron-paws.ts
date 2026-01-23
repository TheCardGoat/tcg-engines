import type { CharacterCard } from "@tcg/lorcana-types";

export const balooOlIronPaws: CharacterCard = {
  id: "nnf",
  cardType: "character",
  name: "Baloo",
  version: "Ol' Iron Paws",
  fullName: "Baloo - Ol' Iron Paws",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "007",
  text: "FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 142,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "553ce55ae402433967725f78d62ddd20db118d4f",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { withStrengthXorMore } from "@lorcanito/lorcana-engine/abilities/targets";
// import { targetCardsGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { damageDealtRestrictionEffect } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const name = "FIGHT LIKE A BEAR";
// const text = "Your characters with 7 {S} or more can't be dealt damage.";
//
// const cantBeDealtDamage: StaticAbilityWithEffect = {
//   type: "static",
//   ability: "effects",
//   name: name,
//   text: text,
//   effects: [damageDealtRestrictionEffect],
// };
//
// const yourCharactersWith7StrOrMore: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "zone", value: "play" },
//     { filter: "owner", value: "self" },
//     withStrengthXorMore(7),
//   ],
// };
//
// export const balooOlIronPaws: LorcanitoCharacterCard = {
//   id: "cpi",
//   name: "Baloo",
//   title: "Ol' Iron Paws",
//   characteristics: ["storyborn", "ally"],
//   text: "FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 6,
//   strength: 5,
//   willpower: 4,
//   illustrator: "Sergio Mancini",
//   number: 142,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618325,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [
//     targetCardsGains({
//       name: name,
//       text: text,
//       target: yourCharactersWith7StrOrMore,
//       ability: cantBeDealtDamage,
//     }),
//   ],
// };
//
