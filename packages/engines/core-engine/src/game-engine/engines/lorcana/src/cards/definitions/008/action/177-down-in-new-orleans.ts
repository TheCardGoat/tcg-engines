import type {
  LorcanitoActionCard,
  ResolutionAbility,
  TargetFilter,
} from "@lorcanito/lorcana-engine";
import { self } from "@lorcanito/lorcana-engine/abilities/targets";

const downInNewOrleansFilter: TargetFilter[] = [
  { filter: "owner", value: "self" },
  { filter: "zone", value: "deck" },
  { filter: "type", value: ["character", "item", "location"] },
  {
    filter: "attribute",
    value: "cost",
    comparison: { operator: "lte", value: 6 },
  },
];

const downInNewOrleansAbility: ResolutionAbility = {
  type: "resolution",
  effects: [
    {
      type: "scry",
      amount: 3,
      mode: "bottom",
      shouldRevealTutored: true,
      playExerted: false,
      target: self,
      limits: {
        bottom: 3,
        play: 1,
      },
      playFilters: downInNewOrleansFilter,
      tutorFilters: downInNewOrleansFilter,
    },
  ],
};

export const downInNewOrleans: LorcanitoActionCard = {
  id: "py1",
  name: "Down In New Orleans",
  characteristics: ["action", "song"],
  text: "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
  type: "action",
  inkwell: false,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Robin Chung",
  number: 177,
  set: "008",
  rarity: "super_rare",
  abilities: [downInNewOrleansAbility],
};
