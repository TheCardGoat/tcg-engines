import type { CharacterCard } from "@tcg/lorcana-types";

export const madHatterEccentricHost: CharacterCard = {
  id: "yx8",
  cardType: "character",
  name: "Mad Hatter",
  version: "Eccentric Host",
  fullName: "Mad Hatter - Eccentric Host",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 59,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ddd893d570009b591ed37e3bb562cfaa675b764",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type {
//   LorcanitoCharacterCard,
//   ScryEffect,
// } from "@lorcanito/lorcana-engine";
// import { chosenPlayer } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { CreateLayerTargetingPlayer } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// const lookAndDiscard: ScryEffect = {
//   type: "scry",
//   amount: 1,
//   mode: "discard",
//   shouldRevealTutored: false,
//   target: chosenPlayer, // This will be overwritten by the chosen player from "create-layer-targeting-player" effect
//   limits: {
//     discard: 1,
//     top: 1,
//   },
// };
//
// const weWillHaveToLookIntoThis: CreateLayerTargetingPlayer = {
//   type: "create-layer-targeting-player",
//   target: chosenPlayer,
//   layer: {
//     type: "resolution",
//     name: "We'll Have To Look Into This",
//     text: "Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
//     effects: [lookAndDiscard],
//   },
// };
//
// export const madHatterEccentricHost: LorcanitoCharacterCard = {
//   id: "lld",
//   name: "Mad Hatter",
//   title: "Eccentric Host",
//   characteristics: ["storyborn"],
//   text: "WE'LL HAVE TO LOOK INTO THIS Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
//   type: "character",
//   abilities: [
//     wheneverQuests({
//       name: "We'll Have To Look Into This",
//       text: "Whenever this character quests, you may look at the top card of chosen player's deck. Put it on top of their deck or into their discard.",
//       optional: false,
//       effects: [weWillHaveToLookIntoThis],
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 1,
//   strength: 1,
//   willpower: 1,
//   lore: 1,
//   illustrator: "Matthew Robert Davies",
//   number: 59,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593022,
//   },
//   rarity: "super_rare",
// };
//
