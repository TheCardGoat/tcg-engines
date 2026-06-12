import type { CharacterCard } from "@tcg/op-types";
import { eb02Yamato006I18n } from "./006-yamato.i18n.ts";

export const eb02Yamato006: CharacterCard = {
  id: "EB02-006",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "EB02",
  cost: 6,
  power: 7000,
  traits: ["Land of Wano"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-006_p1.png",
      imageId: "EB02-006_p1",
    },
  ],
  effect:
    '[Activate: Main] [Once Per Turn] If your Leader has the "Land of Wano" type or is [Portgas.D.Ace], give up to 1 rested DON!! card to 1 of your Leader. Then, this Character gains [Rush] during this turn.',
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb02Yamato006I18n,
};
