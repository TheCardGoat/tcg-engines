import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import { opponentRevealHand } from "@lorcanito/lorcana-engine/effects/effects";
import type { PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";

const self: PlayerEffectTarget = {
  type: "player",
  value: "self",
};

export const nothingToHide: LorcanitoActionCard = {
  id: "q9s",

  name: "Nothing to Hide",
  characteristics: ["action"],
  text: "Each opponent reveals their hand. Draw a card.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Nothing to Hide",
      text: "Each opponent reveals their hand. Draw a card.",
      effects: [
        {
          type: "draw",
          amount: 1,
          target: self,
        },
        opponentRevealHand,
      ],
    },
  ],
  flavour: "Helps you avoid unpleasant surprises.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Mane Kandalyan / Jochem Van Gool",
  number: 165,
  set: "ROF",
  rarity: "common",
};
