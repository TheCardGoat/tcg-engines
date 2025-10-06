import { yourOtherCharacters } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kuzcoSelfishEmperor: LorcanaCharacterCardDefinition = {
  id: "v40",
  name: "Kuzco",
  title: "Selfish Emperor",
  characteristics: ["storyborn", "king"],
  text: "**OUTPLACEMENT** When you play this character, you may put chosen item or location into its player’s inkwell facedown and exerted. **BY INVITE ONLY** 4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Outplacement",
      text: "When you play this character, you may put chosen item or location into its player’s inkwell facedown and exerted.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "inkwell",
          exerted: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: ["item", "location"] },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
    {
      type: "activated",
      name: "**BY INVITE ONLY**",
      text: "4 {I} − Your other characters gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
      costs: [{ type: "ink", amount: 4 }],
      effects: [
        {
          type: "ability",
          ability: "resist",
          modifier: "add",
          duration: "next_turn",
          amount: 1,
          until: true,
          target: yourOtherCharacters,
        },
      ],
    },
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  illustrator: "Carlos Ruiz",
  number: 149,
  set: "SSK",
  rarity: "super_rare",
};
