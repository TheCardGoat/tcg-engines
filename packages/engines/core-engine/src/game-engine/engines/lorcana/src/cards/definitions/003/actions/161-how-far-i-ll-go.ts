import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const howFarIllGo: LorcanaActionCardDefinition = {
  id: "x7c",
  name: "How Far I'll Go",
  characteristics: ["action", "song"],
  text: "_(A character with cost 4 or more can {E} to sing this song for free.)_\n\n\nLook at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
      effects: [
        {
          type: "scry",
          amount: 2,
          mode: "inkwell",
          shouldRevealTutored: false,
          target: self,
          limits: {
            bottom: 0,
            top: 0,
            hand: 1,
            inkwell: 1,
          },
          tutorFilters: [
            { filter: "owner", value: "self" },
            { filter: "zone", value: "deck" },
          ],
        },
      ],
    },
  ],
  colors: ["sapphire"],
  cost: 4,
  illustrator: "Anna Rud / Anna Stosik",
  number: 161,
  set: "ITI",
  rarity: "uncommon",
};
