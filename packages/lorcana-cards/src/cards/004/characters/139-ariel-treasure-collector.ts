import type { CharacterCard } from "@tcg/lorcana-types";

export const arielTreasureCollector: CharacterCard = {
  id: "hyy",
  cardType: "character",
  name: "Ariel",
  version: "Treasure Collector",
  fullName: "Ariel - Treasure Collector",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Ward (Opponents can't choose this character except to challenge.)\nTHE GIRL WHO HAS EVERYTHING While you have more items in play than each opponent, this character gets +2 {L}.",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  cardNumber: 139,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "40c4bd3ba073f42de5b7fe1697a04fdd67105db4",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets } from "@lorcanito/lorcana-engine/abilities/whileAbilities";
//
// export const arielTreasureCollector: LorcanitoCharacterCard = {
//   id: "stn",
//   name: "Ariel",
//   title: "Treasure Collector",
//   characteristics: ["hero", "storyborn", "princess"],
//   text: "**Ward** _(Opponents can't choose this character except to challenge.)_\n\n\n** THE GIRLS WHO HAS EVERYTHING** While you have more items in play than each opponent, this character gets +2 {L}.",
//   type: "character",
//   abilities: [
//     whileYouHaveMoreItemsInPlayThanEachOpponentThisCharacterGets({
//       name: "THE GIRLS WHO HAS EVERYTHING",
//       text: "While you have more items in play than each opponent, this character gets +2 {L}.",
//       attribute: "lore",
//       amount: 2,
//     }),
//     wardAbility,
//   ],
//   colors: ["sapphire"],
//   cost: 6,
//   strength: 3,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Miss Tania Soler",
//   number: 139,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549440,
//   },
//   rarity: "super_rare",
// };
//
