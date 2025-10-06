import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const dalmatianPuppyTailWagger: LorcanitoCharacterCardDefinition = {
  id: "xvo",
  reprints: ["n4q"],
  name: "Dalmatian Puppy",
  title: "Tail Wagger",
  characteristics: ["storyborn", "puppy"],
  text: "**WHERE DID THEY ALL COME FROM?** You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.",
  type: "character",
  abilities: [
    // {
    //   name: "**WHERE DID THEY ALL COME FROM?** You may have up to 99 copies of Dalmatian Puppy - Tail Wagger in your deck.",
    // },
    // add this effect once we limit the number of cards in the deck
  ],
  flavour: "First they steal your heart. Then they steal your chair.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Kapik",
  number: 4,
  set: "ITI",
  rarity: "common",
  cardCopyLimit: 99, // This is a special case for this card
};
