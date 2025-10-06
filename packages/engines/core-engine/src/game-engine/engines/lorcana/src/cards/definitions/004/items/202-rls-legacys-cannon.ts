import { chosenCharacterOrLocation } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rlsLegacysCannon: LorcanaItemCardDefinition = {
  id: "etn",
  missingTestCase: true,
  name: "RLS Legacy's Cannon",
  characteristics: ["item"],
  text: "**BA-BOOM!** {E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "BA-BOOM!",
      costs: [
        { type: "exert" },
        {
          type: "ink",
          amount: 2,
        },
        {
          type: "card",
          amount: 1,
          action: "discard",
          filters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "hand" },
          ],
        },
      ],
      text: "{E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.",
      effects: [
        {
          type: "damage",
          amount: 2,
          target: chosenCharacterOrLocation,
        },
      ],
    },
  ],
  flavour:
    "So help me, I'll use the ship's cannons to blast ya all to kingdom come!\n−John Silver",
  colors: ["steel"],
  cost: 3,
  illustrator: "Luigi Aime",
  number: 202,
  set: "URR",
  rarity: "rare",
};
