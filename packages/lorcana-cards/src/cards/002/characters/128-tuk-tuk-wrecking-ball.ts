import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukWreckingBall: CharacterCard = {
  id: "1or",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Wrecking Ball",
  fullName: "Tuk Tuk - Wrecking Ball",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  text: "Reckless (This character can't quest and must challenge each turn if able.)",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 0,
  cardNumber: 128,
  inkable: false,
  externalIds: {
    ravensburger: "db06f844bce8daadacf3b667fc574090eded709d",
  },
  abilities: [
    {
      id: "1or-1",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { recklessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const tukTukWreckingBall: LorcanitoCharacterCard = {
//   id: "nqd",
//
//   name: "Tuk Tuk",
//   title: "Wrecking Ball",
//   characteristics: ["storyborn", "ally"],
//   text: "**Reckless** _(This character can't quest and must challenge each turn if able.)_",
//   type: "character",
//   abilities: [recklessAbility],
//   flavour: "A good friend is always ready to roll.",
//   colors: ["ruby"],
//   cost: 4,
//   strength: 4,
//   willpower: 5,
//   lore: 0,
//   illustrator: "Brian Weisz",
//   number: 128,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527759,
//   },
//   rarity: "rare",
// };
//
