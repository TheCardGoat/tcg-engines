import { banishEffect } from "~/game-engine/engines/lorcana/src/abilities/effect/effect";
import { allItemsTarget } from "~/game-engine/engines/lorcana/src/abilities/targets/card-target";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const iFindEmIFlattenEm: LorcanaActionCardDefinition = {
  id: "h30",
  name: "I Find 'Em, I Flatten 'Em",
  characteristics: ["action", "song"],
  text: "Banish all items.",
  type: "action",
  abilities: [
    {
      type: "static",
      text: "Banish all items.",
      targets: [allItemsTarget],
      effects: [banishEffect()],
    },
  ],
  flavour:
    "All the most difficult missions are for me, because I am indestructible.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  illustrator: "Jennifer Park",
  number: 196,
  set: "URR",
  rarity: "uncommon",
};
