import type { CharacterCard } from "@tcg/lorcana-types";

export const kuzcoSelfishEmperor: CharacterCard = {
  id: "c7f",
  cardType: "character",
  name: "Kuzco",
  version: "Selfish Emperor",
  fullName: "Kuzco - Selfish Emperor",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.\nBY INVITE ONLY 4 {I} — Your other characters gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  externalIds: {
    ravensburger: "2bfe4a1c3dbc8ce3314e8b370ec958cd749dd8e2",
  },
  abilities: [
    {
      id: "c7f-1",
      text: "OUTPLACEMENT When you play this character, you may put chosen item or location into its player's inkwell facedown and exerted.",
      name: "OUTPLACEMENT",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "chosen-card-in-play",
          exerted: true,
        },
      },
    },
    {
      id: "c7f-2",
      text: "BY INVITE ONLY {d} {I} — Your other characters gain Resist +{d} until the start of your next turn.",
      name: "BY INVITE ONLY",
      type: "activated",
      cost: {
        ink: 0,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 0,
        target: {
          selector: "all",
          owner: "you",
          filter: [{ type: "source", ref: "other" }],
          count: "all",
        },
        duration: "until-start-of-next-turn",
      },
    },
  ],
  classifications: ["Storyborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const kuzcoSelfishEmperor: LorcanitoCharacterCard = {
//   id: "v40",
//   name: "Kuzco",
//   title: "Selfish Emperor",
//   characteristics: ["storyborn", "king"],
//   text: "**OUTPLACEMENT** When you play this character, you may put chosen item or location into its player’s inkwell facedown and exerted. **BY INVITE ONLY** 4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Outplacement",
//       text: "When you play this character, you may put chosen item or location into its player’s inkwell facedown and exerted.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["item", "location"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       type: "activated",
//       name: "**BY INVITE ONLY**",
//       text: "4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//       costs: [{ type: "ink", amount: 4 }],
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           modifier: "add",
//           duration: "next_turn",
//           amount: 1,
//           until: true,
//           target: yourOtherCharacters,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Carlos Ruiz",
//   number: 149,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561164,
//   },
//   rarity: "super_rare",
// };
//
