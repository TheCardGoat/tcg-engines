import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineQueenOfAgrabah: CharacterCard = {
  id: "8w9",
  cardType: "character",
  name: "Jasmine",
  version: "Queen of Agrabah",
  fullName: "Jasmine - Queen of Agrabah",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "001",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Jasmine.)\nCARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
  cost: 5,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  externalIds: {
    ravensburger: "200fff92d3781279a953ae4972866a4954a0ed17",
  },
  abilities: [
    {
      id: "8w9-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "8w9-2",
      text: "CARETAKER When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
      name: "CARETAKER",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          target: "YOUR_CHARACTERS",
          upTo: true,
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Queen"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const jasmineQueenOfAgrabah: LorcanitoCharacterCard = {
//   id: "a4n",
//   name: "Jasmine",
//   title: "Queen of Agrabah",
//   characteristics: ["floodborn", "hero", "queen", "princess"],
//   text: "**Shift** 3 _(You may pay 3 * to play this on top of one of your characters named Jasmine.)_\n\n**CARETAKER** When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
//   type: "character",
//   abilities: [
//     ...whenPlayAndWheneverQuests({
//       name: "Caretaker",
//       text: "When you play this character and whenever she quests, you may remove up to 2 damage from each of your characters.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         },
//       ],
//     }),
//     shiftAbility(3, "Jasmine"),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 2,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Filipe Laurentino",
//   number: 149,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508857,
//   },
//   rarity: "rare",
// };
//
