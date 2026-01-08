// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { vanishAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { exertChosenOpposingCharacter } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theSultanRoyalApparition: LorcanitoCharacterCard = {
//   id: "nrh",
//   name: "The Sultan",
//   title: "Royal Apparition",
//   characteristics: ["dreamborn", "ally", "king", "illusion"],
//   text: "Vanish (When an opponent chooses this character for an action, banish them.)\nCOMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
//   type: "character",
//   abilities: [
//     vanishAbility,
//     wheneverQuests({
//       name: "COMMANDING PRESENCE",
//       text: "Whenever one of your Illusion characters quests, exert chosen opposing character.",
//       triggerTarget: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "type", value: "character" },
//           { filter: "characteristics", value: ["illusion"] },
//           { filter: "owner", value: "self" },
//           { filter: "zone", value: "play" },
//         ],
//       },
//       effects: [exertChosenOpposingCharacter],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst", "steel"],
//   cost: 5,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Max Ulichney",
//   number: 73,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 633425,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
