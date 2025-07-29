import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { singerTogetherAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { allOpposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";

export const headsHeldHigh: LorcanaActionCardDefinition = {
  id: "tfh",
  missingTestCase: true,
  name: "Heads Held High",
  characteristics: ["action", "song"],
  text: "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
  type: "action",
  abilities: [
    singerTogetherAbility(6),
    {
      type: "resolution",
      effects: [
        {
          type: "heal",
          amount: 3,
          target: {
            type: "card",
            value: "all",
            filters: [
              { filter: "zone", value: "play" },
              { filter: "owner", value: "self" },
              { filter: "type", value: "character" },
            ],
          },
        },
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "subtract",
          duration: "next_turn",
          until: true,
          target: allOpposingCharacters,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  illustrator: "Lorenza Pigliamosche / Livio Cacciatore",
  number: 175,
  set: "008",
  rarity: "rare",
};
