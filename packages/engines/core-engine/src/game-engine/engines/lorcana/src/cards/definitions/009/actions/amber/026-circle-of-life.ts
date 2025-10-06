import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { singerTogetherAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerTogetherAbility";

export const circleOfLife: LorcanaActionCardDefinition = {
  id: "w6g",
  missingTestCase: false,
  name: "Circle Of Life",
  characteristics: ["action", "song"],
  text: "Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)\nPlay a character from your discard for free.",
  type: "action",
  inkwell: true,
  colors: ["amber"],
  cost: 8,
  illustrator: "Eri Welli",
  number: 26,
  set: "009",
  rarity: "legendary",
  abilities: [
    singerTogetherAbility(8),
    {
      type: "resolution",
      name: "**CIRCLE OF LIFE**",
      text: "Play a character from your discard for free.",
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
              { filter: "type", value: "character" },
            ],
          },
        },
      ],
    },
  ],
};
