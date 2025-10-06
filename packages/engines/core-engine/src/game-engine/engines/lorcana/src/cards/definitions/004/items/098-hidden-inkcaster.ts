import { whenYouPlayMayDrawACard } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

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
