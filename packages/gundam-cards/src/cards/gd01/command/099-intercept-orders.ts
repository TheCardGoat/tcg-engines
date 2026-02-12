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
  cardNumber: "GD01-099",
  cardType: "COMMAND",
  color: "blue",
  cost: 2,
  effects: [
    {
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
      category: "triggered",
      id: "gd01-099-burst-1",
      text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.",
      timing: { type: "BURST", timing: "after" },
      // Note: HP filter (5 or less) is not directly mappable to TargetStateFilter
      // This filter would need custom handling in the effect execution layer
    },
    {
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
      category: "command",
      id: "gd01-099-main-action-1",
      text: "【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
      timing: { type: "MAIN" },
      // Note: HP filter (3 or less) is not directly mappable to TargetStateFilter
      // This filter would need custom handling in the effect execution layer
    },
  ],
  id: "gd01-099",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-099.webp?26013001",
  keywords: [],
  level: 4,
  name: "Intercept Orders",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【Burst】Choose 1 enemy Unit with 5 or less HP. Rest it.\n【Main】/【Action】Choose 1 to 2 enemy Units with 3 or less HP. Rest them.",
  timing: "MAIN",
};
