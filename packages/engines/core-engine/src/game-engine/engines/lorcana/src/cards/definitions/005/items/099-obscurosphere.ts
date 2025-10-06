import type {
  AbilityEffect,
  LorcanitoItemCard,
} from "@lorcanito/lorcana-engine";
import { yourCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";

export const obscurosphere: LorcanaItemCardDefinition = {
  id: "z4x",
  missingTestCase: true,
  name: "Obscurosphere",
  characteristics: ["item"],
  text: "**EXTRACT OF EMERALD** 2 {I}, Banish this item – Your characters gain **Ward** until the start of your next turn. _(Opponents can't choose them except to challenge.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "**EXTRACT OF EMERALD**",
      text: "2 {I}, Banish this item – Your characters gain **Ward** until the start of your next turn. _(Opponents can't choose them except to challenge.)_",
      costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
      effects: [
        {
          type: "ability",
          ability: "ward",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: yourCharacters,
        } as AbilityEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["emerald"],
  cost: 1,
  illustrator: "Stefano Zanchi",
  number: 99,
  set: "SSK",
  rarity: "common",
};
