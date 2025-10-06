import { youGainLore } from "~/game-engine/engines/lorcana/src/abilities/effect";
import { actionCardsInHand } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverPlays } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const owlIslandSecludedEntrance: LorcanaLocationCardDefinition = {
  id: "ox9",
  name: "Owl Island",
  title: "Secluded Entrance",
  characteristics: ["location"],
  text: "TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.\nLOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.",
  type: "location",
  abilities: [
    {
      type: "static",
      ability: "effects",
      name: "Teamwork",
      text: "For each character you have here, you pay 1 {I} less for the first action you play each turn.",
      conditions: [
        {
          type: "chars-at-location",
          comparison: { operator: "gte", value: 1 },
        },
        { type: "played-actions", comparison: { operator: "eq", value: 0 } },
      ],
      effects: [
        {
          type: "attribute",
          attribute: "cost",
          amount: {
            dynamic: true,
            sourceAttribute: "chars-at-location",
          },
          modifier: "subtract",
          duration: "static",
          target: actionCardsInHand,
        },
      ],
    },
    wheneverPlays({
      name: "Lots to Learn",
      text: "Whenever you play a second action in a turn, gain 3 lore.",
      triggerTarget: {
        type: "card",
        value: 1,
        filters: [
          { filter: "type", value: "action" },
          { filter: "owner", value: "self" },
          {
            filter: "turn",
            value: "played",
            targetFilter: [{ filter: "type", value: "action" }],
            comparison: { operator: "eq", value: 2 },
          },
        ],
      },
      effects: [youGainLore(3)],
    }),
  ],
  inkwell: false,
  colors: ["emerald"],
  cost: 3,
  willpower: 6,
  moveCost: 1,
  illustrator: "Alex Accorsi",
  number: 102,
  set: "006",
  rarity: "rare",
};
