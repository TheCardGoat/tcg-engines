import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverAlienPirate: CharacterCard = {
  id: "a8j",
  cardType: "character",
  name: "John Silver",
  version: "Alien Pirate",
  fullName: "John Silver - Alien Pirate",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can",
      id: "a8j-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Alien", "Storyborn", "Villain", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const johnSilverAlienPirate: LorcanitoCharacterCard = {
//   id: "a8j",
//   reprints: ["hsz"],
//
//   name: "John Silver",
//   title: "Alien Pirate",
//   characteristics: ["alien", "storyborn", "villain", "pirate", "captain"],
//   text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   type: "character",
//   abilities: whenPlayAndWheneverQuests({
//     name: "Pick Your Fights",
//     text: "When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//     effects: [
//       {
//         type: "ability",
//         ability: "reckless",
//         modifier: "add",
//         duration: "next_turn",
//         target: {
//           type: "card",
//           value: 1,
//           filters: [
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "opponent" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       },
//     ],
//   }),
//   flavour: "Don't be too put off by this . . . hunk of hardware.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Jared Nickerl",
//   number: 82,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 507476,
//   },
//   rarity: "legendary",
// };
//
