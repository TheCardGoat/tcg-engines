import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kodaTalkativeCub: LorcanaCharacterCardDefinition = {
  notImplemented: true,
  id: "ftx",
  missingTestCase: true,
  name: "Koda",
  title: "Talkative Cub",
  characteristics: ["storyborn", "ally"],
  text: "**TELL EVERYBODY** During opponents' turns, you can't lose lore.",
  type: "character",
  abilities: [
    // TODO: I'm not implementing this
    // {
    //   name: "**TELL EVERYBODY** During opponents' turns, you can't lose lore.",
    // },
  ],
  flavour: "I mean, I don't want to brag or nothing, but I got some moves.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  illustrator: "Therese Vildefall",
  number: 1,
  set: "SSK",
  rarity: "rare",
};
