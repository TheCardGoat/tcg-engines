import type { EventCard } from "@tcg/op-types";
import { op16HallowedGlacierSlash100I18n } from "./op16-100-hallowed-glacier-slash.i18n.ts";

export const op16HallowedGlacierSlash100: EventCard = {
  id: "OP16-100",
  canonicalId: "OP16-100",
  slug: "hallowed-glacier-slash/op16-100",
  name: "Hallowed Glacier Slash",
  printings: [
    {
      id: "OP16-100",
      artId: "OP16-100",
      setCode: "OP16",
      collectorNumber: "100",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP16-100_8tEoAoQ.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP16",
  cost: 1,
  traits: ["Land of Wano"],
  effect:
    "[Main] You may rest 2 of your DON!! cards: If your opponent's Character has been K.O.'d during this turn, set your Leader [Yamato] as active.\n[Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op16HallowedGlacierSlash100I18n,
};
