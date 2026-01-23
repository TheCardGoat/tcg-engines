import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckParanormalInvestigator: CharacterCard = {
  id: "1pp",
  cardType: "character",
  name: "Daisy Duck",
  version: "Paranormal Investigator",
  fullName: "Daisy Duck - Paranormal Investigator",
  inkType: ["sapphire"],
  set: "010",
  text: "Shift 4 {I} (You may pay 4 {I} to play this on top of one of your characters named Daisy Duck.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nSTRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 154,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de6a595285baab6c696be402cabc1e2f72843de3",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   CardEffectTarget,
//   ExertEffect,
//   LorcanitoCharacterCard,
// } from "@lorcanito/lorcana-engine";
// import {
//   shiftAbility,
//   supportAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileThisCharacterIsExerted } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { anyCardYourOpponentOwns } from "@lorcanito/lorcana-engine/abilities/target";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// const cardTarget: CardEffectTarget = {
//   type: "card",
//   value: "all",
//   filters: [
//     {
//       filter: "trigger",
//       value: "target",
//     },
//   ],
// };
// export const enterPlaysExerted: ExertEffect = {
//   type: "exert",
//   exert: true,
//   target: cardTarget,
// };
//
// export const daisyDuckParanormalInvestigator: LorcanitoCharacterCard = {
//   id: "ckd",
//   name: "Daisy Duck",
//   title: "Paranormal Investigator",
//   characteristics: ["floodborn", "hero", "detective"],
//   text: "Shift 4\n\nSupport\n\nSTRANGE HAPPENINGS While this character is exerted, cards enter opponents' inkwells exerted.",
//   type: "character",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 4,
//   willpower: 6,
//   illustrator: "Grace Tran",
//   number: 154,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 657886,
//   },
//   rarity: "legendary",
//   lore: 2,
//   abilities: [
//     shiftAbility(4, "Daisy Duck"),
//     supportAbility,
//     wheneverACardIsPutIntoYourInkwell({
//       name: "STRANGE HAPPENINGS",
//       text: "While this character is exerted, cards enter opponents' inkwells exerted.",
//       target: anyCardYourOpponentOwns,
//       effects: [enterPlaysExerted],
//       conditions: [whileThisCharacterIsExerted],
//     }),
//   ],
// };
//
