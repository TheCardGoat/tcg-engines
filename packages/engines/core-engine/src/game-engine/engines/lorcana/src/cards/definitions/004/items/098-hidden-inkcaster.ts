import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";

export const hiddenInkcaster: LorcanaItemCardDefinition = {
  id: "efb",
  missingTestCase: true,
  name: "Hidden Inkcaster",
  characteristics: ["item"],
  text: "**FRESH INK** When you play this item, draw a card.\n\n\n**UNEXPECTED TREASURE** All cards in your hand count as having ⏣.",
  type: "item",
  abilities: [
    {
      ...whenYouPlayMayDrawACard,
      name: "Fresh Ink",
    },
  ],
  flavour: "It looks like it's been here forever. \n–Flounder",
  colors: ["emerald"],
  cost: 2,
  illustrator: "Adam Fenton",
  number: 98,
  set: "URR",
  rarity: "common",
};
