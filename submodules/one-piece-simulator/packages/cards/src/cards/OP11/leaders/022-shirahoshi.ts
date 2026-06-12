import type { LeaderCard } from "@tcg/op-types";
import { op11Shirahoshi022I18n } from "./022-shirahoshi.i18n.ts";

export const op11Shirahoshi022: LeaderCard = {
  id: "OP11-022",
  cardType: "leader",
  color: ["green", "yellow"],
  rarity: "L",
  setId: "OP11",
  power: 5000,
  life: 5,
  traits: ["Merfolk Fish-Man Island"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-022_p1.jpg",
      imageId: "OP11-022_p1",
    },
  ],
  effect:
    'This Leader cannot attack.\n[Activate: Main] [Once Per Turn] You may rest 1 of your DON!! cards and turn 1 card from the top of your Life cards face-up: Play up to 1 "Neptunian" type Character card or "Megalo" with a cost equal to or less than the number of DON!! cards on your field from your hand.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "trait",
                value: "Neptunian",
              },
            ],
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op11Shirahoshi022I18n,
};
