import type { CharacterCard } from "@tcg/lorcana-types";

export const daisyDuckPirateCaptain: CharacterCard = {
  id: "zzu",
  cardType: "character",
  name: "Daisy Duck",
  version: "Pirate Captain",
  fullName: "Daisy Duck - Pirate Captain",
  inkType: ["emerald"],
  set: "006",
  text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 81,
  inkable: true,
  externalIds: {
    ravensburger: "81bb233190edd5db1df45cfb55355201fc429a34",
  },
  abilities: [
    {
      id: "zzu-1",
      text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
      name: "DISTANT SHORES",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverACharacterQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const daisyDuckPirateCaptain: LorcanitoCharacterCard = {
//   id: "zbi",
//   name: "Daisy Duck",
//   title: "Pirate Captain",
//   characteristics: ["dreamborn", "hero", "pirate", "captain"],
//   text: "DISTANT SHORES Whenever one of your Pirate characters quests while at a location, draw a card.",
//   type: "character",
//   abilities: [
//     wheneverACharacterQuests({
//       name: "Distant Shores",
//       text: "Whenever one of your Pirate characters quests while at a location, draw a card.",
//       optional: false,
//       effects: [drawACard],
//       characterFilter: [
//         { filter: "characteristics", value: ["pirate"] },
//         { filter: "type", value: "character" },
//         { filter: "owner", value: "self" },
//         { filter: "zone", value: "play" },
//         { filter: "status", value: "at-location" },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Jochem van Gool",
//   number: 81,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592039,
//   },
//   rarity: "super_rare",
// };
//
