import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { moveToLocation } from "@lorcanito/lorcana-engine/effects/effects";

export const voyage: LorcanaActionCardDefinition = {
  id: "y55",
  name: "Voyage",
  characteristics: ["action"],
  text: "Move up to 2 characters of yours to the same location for free.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        moveToLocation({
          type: "card",
          value: 2,
          upTo: true,
          filters: [
            { filter: "type", value: "character" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
        }),
      ],
    },
  ],
  flavour: "We were voyagers! Why'd we stop? –Moana",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Alex Shin",
  number: 131,
  set: "ITI",
  rarity: "common",
};
