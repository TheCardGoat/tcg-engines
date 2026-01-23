import type { CharacterCard } from "@tcg/lorcana-types";

export const basilPracticedDetective: CharacterCard = {
  id: "jeb",
  cardType: "character",
  name: "Basil",
  version: "Practiced Detective",
  fullName: "Basil - Practiced Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 153,
  inkable: true,
  externalIds: {
    ravensburger: "45e94574ada65e2810ad87f119a52fc83df37d25",
  },
  abilities: [
    {
      id: "jeb-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const basilPracticedDetective: LorcanitoCharacterCard = {
//   id: "orz",
//   name: "Basil",
//   title: "Practiced Detective",
//   characteristics: ["hero", "storyborn", "detective"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_",
//   type: "character",
//   abilities: [supportAbility],
//   flavour: "This case is as good as solved!\n−Basil",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   strength: 2,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Eva Widermann",
//   number: 153,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559713,
//   },
//   rarity: "common",
// };
//
