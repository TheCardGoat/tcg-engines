import type { CharacterCard } from "@tcg/lorcana-types";

export const bruniFireSalamander: CharacterCard = {
  id: "29y",
  cardType: "character",
  name: "Bruni",
  version: "Fire Salamander",
  fullName: "Bruni - Fire Salamander",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPARTING GIFT When this character is banished, you may draw a card.",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 40,
  inkable: true,
  externalIds: {
    ravensburger: "0834d63e44b4e904e0f5c4efdbb1d73afd4952a7",
  },
  abilities: [
    {
      id: "29y-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "29y-2",
      type: "triggered",
      name: "PARTING GIFT",
      trigger: {
        event: "banish",
        timing: "when",
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
      text: "PARTING GIFT When this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { evasiveAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const bruniFireSalamander: LorcanitoCharacterCard = {
//   id: "dbe",
//   missingTestCase: true,
//   name: "Bruni",
//   title: "Fire Salamander",
//   characteristics: ["storyborn", "ally"],
//   text: "**Evasive** _(Only characters with Evasive can challenge this character.)_ **PARTING GIFT** When this character is banished, you may draw a card.",
//   type: "character",
//   abilities: [
//     evasiveAbility,
//     whenThisCharacterBanished({
//       name: "Parting Gift",
//       text: "When this character is banished, you may draw a card.",
//       optional: true,
//       effects: [drawACard],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 2,
//   willpower: 2,
//   lore: 2,
//   illustrator: "Kendall Hale",
//   number: 40,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 555244,
//   },
//   rarity: "uncommon",
// };
//
