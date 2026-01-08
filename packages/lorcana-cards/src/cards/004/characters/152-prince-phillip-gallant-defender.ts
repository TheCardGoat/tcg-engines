import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipGallantDefender: CharacterCard = {
  id: "1f7",
  cardType: "character",
  name: "Prince Phillip",
  version: "Gallant Defender",
  fullName: "Prince Phillip - Gallant Defender",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nBEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  cardNumber: 152,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bb53658c9147113243c4c288f17f357b4f9b6cb3",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { supportAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const princePhillipGallantDefender: LorcanitoCharacterCard = {
//   id: "emu",
//   missingTestCase: true,
//   name: "Prince Phillip",
//   title: "Gallant Defender",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_\n\n \n**BEST DEFENSE** Whenver one of your characters is chosen for **Support**, they gain **Resist** +1 this turn. _(Damage dealt to them is reduced by 1.)_",
//   type: "character",
//   abilities: [
//     supportAbility,
//     {
//       name: "**BEST DEFENSE** Whenver one of your characters is chosen for **Support**, they gain **Resist** +1 this turn. _(Damage dealt to them is reduced by 1.)_",
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 3,
//   strength: 1,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Mike Parker",
//   number: 152,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549517,
//   },
//   rarity: "rare",
// };
//
