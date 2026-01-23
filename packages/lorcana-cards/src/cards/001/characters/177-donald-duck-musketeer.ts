import type { CharacterCard } from "@tcg/lorcana-types";
import { bodyguard } from "../../ability-helpers";

export const donaldDuckMusketeer: CharacterCard = {
  id: "1te",
  cardType: "character",
  name: "Donald Duck",
  version: "Musketeer",
  fullName: "Donald Duck - Musketeer",
  inkType: ["steel"],
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSTAY ALERT! During your turn, your Musketeer characters gain Evasive. (They can challenge characters with Evasive.)",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  cardNumber: 177,
  inkable: true,
  externalIds: {
    ravensburger: "eb0f321c8ffffb426862310ebc9a55e6e2d2d5df",
  },
  abilities: [
    bodyguard("1te-1"),
    {
      id: "1te-2",
      text: "STAY ALERT! During your turn, your Musketeer characters gain Evasive.",
      name: "STAY ALERT!",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "YOUR_CHARACTERS",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   bodyguardAbility,
//   evasiveAbility,
//   type GainAbilityStaticAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const donaldDuckMusketeer: LorcanitoCharacterCard = {
//   id: "xnp",
//   name: "Donald Duck",
//   title: "Musketeer",
//   characteristics: ["hero", "dreamborn", "musketeer"],
//   text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_\n\n**STAY ALERT!** During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "gain-ability",
//       name: "Stay Alert!",
//       text: "During your turn, your Musketeer characters gain **Evasive.** _(They can challenge characters with Evasive.)_",
//       gainedAbility: evasiveAbility,
//       conditions: [{ type: "during-turn", value: "self" }],
//       target: {
//         type: "card",
//         value: "all",
//         filters: [
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           { filter: "characteristics", value: ["musketeer"] },
//         ],
//       },
//     } as GainAbilityStaticAbility,
//     bodyguardAbility,
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 2,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Dav Augereau / Guykua Ruva",
//   number: 177,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508907,
//   },
//   rarity: "uncommon",
// };
//
