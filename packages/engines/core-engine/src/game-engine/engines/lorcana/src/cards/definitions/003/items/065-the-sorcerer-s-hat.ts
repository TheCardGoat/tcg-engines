import {
  anyCard,
  namedCard,
} from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaItemCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theSorcerersHat: LorcanaItemCardDefinition = {
  id: "h9u",
  name: "The Sorcerer's Hat",
  characteristics: ["item"],
  text: "**INCREDIBLE ENERGY** {E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
  type: "item",
  abilities: [
    {
      type: "activated",
      name: "Incredible Energy",
      text: "{E}, 1 {I} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand. Otherwise, put it on the top of your deck.",
      costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
      nameACard: true,
      effects: [
        {
          type: "reveal-top-card",
          target: namedCard,
          onTargetMatchEffects: [
            {
              type: "move",
              to: "hand",
              target: anyCard,
            },
          ],
        },
      ],
    },
  ],
  flavour:
    "Minnie approached it cautiously. Whoever had placed it here might have prepared traps.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  illustrator: "Jiahui Eva Gao",
  number: 65,
  set: "ITI",
  rarity: "rare",
};
