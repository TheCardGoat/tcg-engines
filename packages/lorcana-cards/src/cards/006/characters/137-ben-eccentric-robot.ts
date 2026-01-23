import type { CharacterCard } from "@tcg/lorcana-types";

export const benEccentricRobot: CharacterCard = {
  id: "1b2",
  cardType: "character",
  name: "B.E.N.",
  version: "Eccentric Robot",
  fullName: "B.E.N. - Eccentric Robot",
  inkType: ["sapphire"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  cardNumber: 137,
  inkable: true,
  externalIds: {
    ravensburger: "aa97f4df72681860790f4df212f77ab3bf9a7239",
  },
  abilities: [
    {
      id: "1b2-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Robot", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const benEccentricRobot: LorcanitoCharacterCard = {
//   id: "gn6",
//   name: "B.E.N.",
//   title: "Eccentric Robot",
//   characteristics: ["storyborn", "ally", "robot", "pirate"],
//   text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
//   type: "character",
//   abilities: [supportAbility],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 4,
//   strength: 4,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Grdonvi",
//   number: 137,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592999,
//   },
//   rarity: "common",
// };
//
