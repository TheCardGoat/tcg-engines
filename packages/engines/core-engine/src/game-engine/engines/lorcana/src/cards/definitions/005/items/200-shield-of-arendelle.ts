import type {
  AbilityEffect,
  LorcanitoItemCard,
} from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const shieldOfArendelle: LorcanaItemCardDefinition = {
  id: "ws0",
  name: "Shield of Arendelle",
  characteristics: ["item"],
  text: "**DEFLECT** Banish this item – Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Deflect",
      text: "Banish this item – Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
      costs: [{ type: "banish" }],
      effects: [
        {
          type: "ability",
          ability: "resist",
          amount: 1,
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    },
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  illustrator: "Eva Widermann",
  number: 200,
  set: "SSK",
  rarity: "common",
};
