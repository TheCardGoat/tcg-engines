import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const developYourBrain: LorcanaActionCardDefinition = {
  id: "yy9",
  name: "Develop Your Brain",
  characteristics: ["action"],
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Develop Your Brain",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "bottom",
          shouldRevealTutored: false,
          target: self,
          limits: {
            bottom: 1,
            inkwell: 0,
            hand: 1,
            top: 0,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    },
  ],
  flavour:
    "„Knowledge, wisdom−there's the <b>real</b> power!\u0003<br />−Merlin",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  illustrator: "Pao Yong",
  number: 161,
  set: "TFC",
  rarity: "common",
};
