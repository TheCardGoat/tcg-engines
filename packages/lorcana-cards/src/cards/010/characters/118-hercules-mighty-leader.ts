import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesMightyLeader: CharacterCard = {
  id: "be7",
  cardType: "character",
  name: "Hercules",
  version: "Mighty Leader",
  fullName: "Hercules - Mighty Leader",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  text: "EVER VIGILANT This character can't be dealt damage unless he's being challenged.\nEVER VALIANT While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.",
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 2,
  cardNumber: 118,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "29116bcf1691cd6dad24659e3c03ae620eafe2f9",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince", "Deity"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import type {
//   GainAbilityStaticAbility,
//   StaticAbilityWithEffect,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// const everVigilant: StaticAbilityWithEffect = {
//   type: "static",
//   ability: "effects",
//   name: "EVER VIGILANT",
//   text: "This character can't be dealt damage unless he's being challenged.",
//   effects: [
//     {
//       type: "protection",
//       from: "damage",
//       exceptAs: "defender", // Protection doesn't apply when being challenged as defender
//       target: thisCharacter,
//     },
//   ],
// };
//
// const yourOtherHeroCharacters: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   excludeSelf: true,
//   filters: [
//     { filter: "type", value: "character" },
//     { filter: "characteristics", value: ["hero"] },
//     { filter: "owner", value: "self" },
//     { filter: "zone", value: "play" },
//   ],
// };
//
// const everValiant: GainAbilityStaticAbility = {
//   type: "static",
//   ability: "gain-ability",
//   name: "EVER VALIANT",
//   text: "While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.",
//   conditions: [{ type: "exerted" }],
//   target: yourOtherHeroCharacters,
//   gainedAbility: {
//     ...everVigilant,
//     name: "EVER VALIANT",
//     text: "Can't be dealt damage unless they're being challenged.",
//   },
// };
//
// export const herculesMightyLeader: LorcanitoCharacterCard = {
//   id: "n74",
//   name: "Hercules",
//   title: "Mighty Leader",
//   characteristics: ["storyborn", "hero", "prince", "deity"],
//   text: "EVER VIGILANT This character can't be dealt damage unless he's being challenged. EVER VALIANT While this character is exerted, your other Hero characters can't be dealt damage unless they're being challenged.",
//   type: "character",
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 5,
//   willpower: 3,
//   illustrator: "Amanda MacFarlane",
//   number: 118,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660037,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [everVigilant, everValiant],
// };
//
