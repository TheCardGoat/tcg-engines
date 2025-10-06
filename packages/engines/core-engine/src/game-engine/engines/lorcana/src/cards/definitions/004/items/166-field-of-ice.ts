import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverYouPlayACharacter } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fieldOfIce: LorcanaItemCardDefinition = {
  id: "r97",
  missingTestCase: true,
  name: "Field of Ice",
  characteristics: ["item"],
  text: "**ICY DEFENSE** Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
  type: "item",
  abilities: [
    wheneverYouPlayACharacter({
      name: "Icy Defense",
      text: "Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
      effects: [
        {
          type: "ability",
          ability: "resist",
          modifier: "add",
          amount: 1,
          duration: "next_turn",
          until: true,
          target: chosenCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 166,
  set: "URR",
  rarity: "rare",
};
