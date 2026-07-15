import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineQueenOfAgrabah: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "8w9-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: "YOUR_CHARACTERS",
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "8w9-2",
      name: "CARETAKER",
      text: "CARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 149,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess", "Queen"],
  cost: 5,
  externalIds: {
    ravensburger: "200fff92d3781279a953ae4972866a4954a0ed17",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Queen of Agrabah",
  id: "8w9",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Jasmine",
  set: "001",
  strength: 2,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jasmine.)\nCARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
  version: "Queen of Agrabah",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const jasmineQueenOfAgrabah: LorcanitoCharacterCard = {
//   Id: "a4n",
//   Name: "Jasmine",
//   Title: "Queen of Agrabah",
//   Characteristics: ["floodborn", "hero", "queen", "princess"],
//   Text: "**Shift** 3 _(You may pay 3 * to play this on top of one of your characters named Jasmine.)_\n\n**CARETAKER** When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
//   Type: "character",
//   Abilities: [
//     ...whenPlayAndWheneverQuests({
//       Name: "Caretaker",
//       Text: "When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 2,
//           UpTo: true,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     }),
//     ShiftAbility(3, "Jasmine"),
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 5,
//   Strength: 2,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Filipe Laurentino",
//   Number: 149,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508857,
//   },
//   Rarity: "rare",
// };
//
