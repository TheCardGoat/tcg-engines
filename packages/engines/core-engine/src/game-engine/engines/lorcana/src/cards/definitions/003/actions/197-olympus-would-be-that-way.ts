import { yourCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const olympusWouldBeThatWay: LorcanaActionCardDefinition = {
  id: "w88",
  name: "Olympus Would Be That Way",
  characteristics: ["action"],
  text: "Your characters get +3 {S} this turn while challenging a location.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "ability",
          ability: "challenger",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: yourCharacters,
        },
      ],
    },
  ],
  flavour:
    "Now that I set you free, what is the first thing you are going to do? \n–Hades",
  inkwell: true,
  colors: ["steel"],
  cost: 1,
  illustrator: "Michaela Martin",
  number: 197,
  set: "ITI",
  rarity: "common",
};
