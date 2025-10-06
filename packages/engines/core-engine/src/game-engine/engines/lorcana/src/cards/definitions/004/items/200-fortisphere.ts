import type { ActivatedAbility } from "~/game-engine/engines/lorcana/src/abilities";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenYouPlayMayDrawACard } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type {
  AbilityEffect,
  LorcanitoItemCard,
} from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fortisphere: LorcanaItemCardDefinition = {
  id: "id0",
  name: "Fortisphere",
  characteristics: ["item"],
  text: "**RESOURCEFUL** When you play this item, you may draw a card.\n\n\n**EXTRACT OF STEEL** 1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
  type: "item",
  abilities: [
    {
      ...whenYouPlayMayDrawACard,
      name: "RESOURCEFUL",
      text: "**RESOURCEFUL** When you play this item, you may draw a card.",
    },
    {
      type: "activated",
      name: "EXTRACT OF STEEL",
      text: "1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
      costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
      effects: [
        {
          type: "ability",
          ability: "bodyguard",
          modifier: "add",
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        } as AbilityEffect,
      ],
    } as ActivatedAbility,
  ],
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  illustrator: "Mariana Moreno Ayala",
  number: 200,
  set: "URR",
  rarity: "common",
};
