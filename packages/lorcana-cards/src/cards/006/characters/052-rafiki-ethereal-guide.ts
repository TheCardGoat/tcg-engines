import type { CharacterCard } from "@tcg/lorcana-types";

export const rafikiEtherealGuide: CharacterCard = {
  id: "yg2",
  cardType: "character",
  name: "Rafiki",
  version: "Ethereal Guide",
  fullName: "Rafiki - Ethereal Guide",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "006",
  text: "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
  cost: 9,
  strength: 6,
  willpower: 6,
  lore: 4,
  cardNumber: 52,
  inkable: false,
  externalIds: {
    ravensburger: "7c256dab47d16a89c757b84431b8ddca2fb61add",
  },
  abilities: [
    {
      id: "yg2-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 7,
      },
      text: "Shift 7",
    },
    {
      id: "yg2-2",
      type: "triggered",
      name: "ASTRAL ATTUNEMENT",
      trigger: {
        event: "ink",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "ASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
    },
  ],
  classifications: ["Floodborn", "Mentor", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const rafikiEtherealGuide: LorcanitoCharacterCard = {
//   id: "zox",
//   missingTestCase: true,
//   name: "Rafiki",
//   title: "Ethereal Guide",
//   characteristics: ["floodborn", "mentor", "sorcerer"],
//   text: "Shift 7 (You may pay 7 {I} to play this on top of one of your characters named Rafiki.)\nASTRAL ATTUNEMENT During your turn, whenever a card is put into your inkwell, you may draw a card.",
//   type: "character",
//   abilities: [
//     shiftAbility(7, "Rafiki"),
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Astral Attunement",
//       text: "During your turn, whenever a card is put into your inkwell, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 9,
//   strength: 6,
//   willpower: 6,
//   lore: 4,
//   illustrator: "Sam Nielson",
//   number: 52,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 580772,
//   },
//   rarity: "rare",
// };
//
