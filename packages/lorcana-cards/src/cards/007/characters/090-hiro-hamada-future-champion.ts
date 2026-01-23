import type { CharacterCard } from "@tcg/lorcana-types";

export const hiroHamadaFutureChampion: CharacterCard = {
  id: "syk",
  cardType: "character",
  name: "Hiro Hamada",
  version: "Future Champion",
  fullName: "Hiro Hamada - Future Champion",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "007",
  text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 90,
  inkable: true,
  externalIds: {
    ravensburger: "686034d962f46489c63777e2863fb97e064b033a",
  },
  abilities: [
    {
      id: "syk-1",
      type: "triggered",
      name: "ORIGIN STORY",
      trigger: {
        event: "play",
        timing: "when",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "draw",
        amount: 1,
        target: "CONTROLLER",
      },
      text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenPlayOnThisCard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
// import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
//
// const shifter: CardEffectTarget["filters"] = [
//   { filter: "owner", value: "self" },
//   { filter: "type", value: "character" },
//   { filter: "characteristics", value: ["floodborn"] },
// ];
//
// const shifted: CardEffectTarget["filters"] = [
//   { filter: "source", value: "self" },
// ];
//
// export const hiroHamadaFutureChampion: LorcanitoCharacterCard = {
//   id: "mc6",
//   name: "Hiro Hamada",
//   title: "Future Champion",
//   characteristics: ["storyborn", "hero", "inventor"],
//   text: "ORIGIN STORY When you play a Floodborn character on this card, draw a card.",
//   type: "character",
//   abilities: [
//     whenPlayOnThisCard({
//       name: "ORIGIN STORY",
//       text: "When you play a Floodborn character on this card, draw a card.",
//       effects: [drawACard],
//       shifterTargetFilters: shifter,
//       shiftedTargetFilters: shifted,
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Jennifer Wu",
//   number: 90,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618250,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
