import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";

export const merlinsCottageTheWizardsHome: LorcanaLocationCardDefinition = {
  id: "d3u",
  name: "Merlin's Cottage",
  title: "The Wizard's Home",
  characteristics: ["location"],
  text: "**KNOWLEDGE IS POWER** Each player plays with the top card of their deck face up.",
  type: "location",
  abilities: [
    // {
    //   name: "**KNOWLEDGE IS POWER**",
    //   text: "Each player plays with the top card of their deck face up.",
    //   TODO: This is implemented directly in the UI
    // },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  willpower: 7,
  illustrator: "Gabe",
  number: 170,
  set: "SSK",
  rarity: "uncommon",
  moveCost: 1,
};
