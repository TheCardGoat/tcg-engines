import type { CommandCardDefinition, Effect } from "@tcg/gundam-types";

/**
 * Intercept Orders - Command Card
 *
 * Legacy → New Effect Migration:
 * - type: "TRIGGERED" → category: "triggered"
 * - type: "CONSTANT" → category: "command" (for Command card main/action effect)
 * - description → text
 * - action → actions: [action] (convert LegacyAction to EffectAction)
 * - Removed: restrictions, costs, conditions (not represented in new Effect)
 * - Added: targeting (derived from legacy action.target)
 */
export const InterceptOrders: CommandCardDefinition = {
  id: "gd01-099",
  name: "Intercept Orders",
  cardNumber: "GD01-099",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "rare",
  color: "blue",
  level: 4,
  cost: 2,
  text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.\n【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
  keywords: [],
  effects: [
    {
      id: "gd01-099-burst-1",
      category: "triggered",
      timing: { type: "BURST", timing: "after" },
      text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.",
      actions: [
        {
          type: "REST",
          target: {
            count: 1,
            validTargets: [
              {
                type: "unit",
                owner: "opponent",
                state: { hasDamageAtLeast: 0 },
              },
            ],
            chooser: "controller",
            timing: "on_resolution",
          },
        },
      ],
      // Note: HP filter (5 or less) is not directly mappable to TargetStateFilter
      // This filter would need custom handling in the effect execution layer
    },
    {
      id: "gd01-099-main-action-1",
      category: "command",
      timing: { type: "MAIN" },
      text: "【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      actions: [
        {
          type: "REST",
          target: {
            count: { min: 1, max: 2 },
            validTargets: [
              {
                type: "unit",
                owner: "opponent",
                state: { hasDamageAtLeast: 0 },
              },
            ],
            chooser: "controller",
            timing: "on_resolution",
          },
        },
      ],
      // Note: HP filter (3 or less) is not directly mappable to TargetStateFilter
      // This filter would need custom handling in the effect execution layer
    },
  ],
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?26013001",
  sourceTitle: "Mobile Suit Gundam",
  timing: "MAIN",
};
