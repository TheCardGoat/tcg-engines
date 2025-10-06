import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielWhoseitCollector: LorcanaCharacterCardDefinition = {
  id: "df2",
  name: "Ariel",
  title: "Whoseit Collector",
  characteristics: ["hero", "storyborn", "princess"],
  text: "**LOOK AT THIS STUFF** Whenever you play an item, you may ready this character.",
  type: "character",
  abilities: [
    wheneverPlays({
      name: "Look at This Stuff",
      text: "Whenever you play an item, you may ready this character.",
      optional: true,
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "item" },
          { filter: "owner", value: "self" },
        ],
      },
      effects: [
        {
          type: "exert",
          exert: false,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
          },
        },
      ],
    }),
  ],
  flavour: "You want thingamabobs? I got twenty.",
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  illustrator: "Hedvig Häggman-Sund",
  number: 137,
  set: "TFC",
  rarity: "rare",
};
