import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyExpertShipwright: CharacterCard = {
  id: "gjx",
  cardType: "character",
  name: "Goofy",
  version: "Expert Shipwright",
  fullName: "Goofy - Expert Shipwright",
  inkType: ["emerald"],
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 3,
  cardNumber: 89,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3ba92e8b5e5401e6d37f5243fdc400fe6c04ceee",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const goofyExpertShipwright: LorcanitoCharacterCard = {
//   id: "b51",
//   name: "Goofy",
//   title: "Expert Shipwright",
//   characteristics: ["dreamborn", "hero", "inventor"],
//   text: "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
//   type: "character",
//   abilities: [
//     wardAbility,
//     wheneverQuests({
//       name: "Clever Design",
//       text: "Whenever this character quests, chosen character gains Ward until the start of your next turn.",
//       effects: [
//         {
//           type: "ability",
//           ability: "ward",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 1,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Max Ulichney",
//   number: 89,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591119,
//   },
//   rarity: "rare",
// };
//
