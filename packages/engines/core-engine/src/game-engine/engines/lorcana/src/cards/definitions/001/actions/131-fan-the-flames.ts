import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";

export const fanTheFlames: LorcanitoActionCard = {
  id: "afx",
  name: "Fan The Flames",
  characteristics: ["action"],
  text: "Ready chosen character. They can't quest for the rest of this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Fan The Flames",
      text: "Ready chosen character. They can't quest for the rest of this turn.",
      effects: readyAndCantQuest({
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "character" },
          { filter: "zone", value: "play" },
        ],
      }),
    },
  ],
  flavour: "Pretty words can move a crowd, but so can ugly ones.",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Jenna Gray",
  number: 131,
  set: "TFC",
  rarity: "uncommon",
};
