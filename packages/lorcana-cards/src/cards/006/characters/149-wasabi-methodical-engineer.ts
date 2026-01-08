import type { CharacterCard } from "@tcg/lorcana-types";

export const wasabiMethodicalEngineer: CharacterCard = {
  id: "l5t",
  cardType: "character",
  name: "Wasabi",
  version: "Methodical Engineer",
  fullName: "Wasabi - Methodical Engineer",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "BLADES OF FURY When you play this character, you may banish chosen item. Its player gains 1 lore.\nQUICK REFLEXES During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 149,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4c44b7fca1f2f6a3616e9dc982897df5179befa0",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenItem } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whileConditionThisCharacterGains } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const wasabiMethodicalEngineer: LorcanitoCharacterCard = {
//   id: "lzm",
//   name: "Wasabi",
//   title: "Methodical Engineer",
//   characteristics: ["hero", "storyborn", "inventor"],
//   text: "**BLADES OF FURY** When you play this character, you may banish chosen item. Its player gains 1 lore.\n\n**QUICK REFLEXES** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
//   type: "character",
//   abilities: [
//     whileConditionThisCharacterGains({
//       name: "QUICK REFLEXES",
//       text: "During your turn, this character gains **Evasive**.",
//       ability: evasiveAbility,
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//     }),
//     {
//       type: "resolution",
//       name: "BLADES OF FURY",
//       optional: true,
//       text: "When you play this character, you may banish chosen item. Its player gains 1 lore.",
//       effects: [
//         {
//           type: "banish",
//           target: chosenItem,
//         },
//         {
//           type: "lore",
//           amount: 1,
//           modifier: "add",
//           target: { type: "player", value: "target_owner" },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Taraneh",
//   number: 149,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578231,
//   },
//   rarity: "uncommon",
// };
//
