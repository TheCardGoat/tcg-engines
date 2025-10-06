import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { whileConditionThisCharacterGains } from "~/game-engine/engines/lorcana/src/abilities/whileAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const gadgetHackwrenchBrilliantBosun: LorcanaCharacterCardDefinition = {
  id: "bdj",
  name: "Gadget Hackwrench",
  title: "Brilliant Bosun",
  characteristics: ["floodborn", "ally", "inventor"],
  text: "**Shift 4** \n\n**MECHANICALLY SAVVY** While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
  type: "character",
  abilities: [
    shiftAbility(4, "Gadget Hackwrench"),
    whileConditionThisCharacterGains({
      name: "MECHANICALLY SAVVY",
      text: "While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "zone", value: "play" },
            { filter: "type", value: "item" },
            { filter: "owner", value: "self" },
          ],
          comparison: { operator: "gte", value: 3 },
        },
      ],
      ability: {
        type: "static",
        ability: "effects",
        effects: [
          {
            type: "attribute",
            attribute: "cost",
            amount: 1,
            modifier: "subtract",
            duration: "static",
            target: {
              type: "card",
              value: "all",
              filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "hand" },
                { filter: "characteristics", value: ["inventor"] },
              ],
            },
          },
        ],
      },
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 3,
  illustrator: "Alex Accorsi",
  number: 140,
  set: "006",
  rarity: "super_rare",
};
