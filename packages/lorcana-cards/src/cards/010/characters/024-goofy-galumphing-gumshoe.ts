import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGalumphingGumshoe: CharacterCard = {
  id: "1mo",
  cardType: "character",
  name: "Goofy",
  version: "Galumphing Gumshoe",
  fullName: "Goofy - Galumphing Gumshoe",
  inkType: ["amber"],
  set: "010",
  text: "Shift 5 {I} (You may pay 5 {I} to play this on top of one of your characters named Goofy.)\nHOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
  cost: 8,
  strength: 5,
  willpower: 7,
  lore: 3,
  cardNumber: 24,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d37fb5ea97b82b11f6873b113789f17f3f37cac0",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenPlayAndWheneverQuests } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { opponentCharactersLoseStrengthUntilNextTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const goofyGalumphingGumshoe: LorcanitoCharacterCard = {
//   id: "jio",
//   name: "Goofy",
//   title: "Galumphing Gumshoe",
//   characteristics: ["floodborn", "hero", "detective"],
//   text: "Shift 5 (You may pay 5 ink to play this on top of one of your characters named Goofy.)\nHOT PURSUIT When you play this character and whenever he quests, each opposing character gets -1 strength until the start of your next turn.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 8,
//   strength: 5,
//   willpower: 7,
//   illustrator: "Giacomo Boni",
//   number: 24,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658497,
//   },
//   rarity: "super_rare",
//   abilities: [
//     shiftAbility(5, "Goofy"),
//     ...whenPlayAndWheneverQuests({
//       name: "HOT PURSUIT",
//       text: "When you play this character and whenever he quests, each opposing character gets -1 strength until the start of your next turn.",
//       effects: [opponentCharactersLoseStrengthUntilNextTurn(1)],
//     }),
//   ],
//   lore: 3,
// };
//
