import type { LeaderCard } from "@tcg/op-types";
import { op01KouzukiOden031I18n } from "./031-kouzuki-oden.i18n.ts";

export const op01KouzukiOden031: LeaderCard = {
  id: "OP01-031",
  cardType: "leader",
  color: ["green"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 5,
  traits: ["Land of Wano Kouzuki Clan"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-031_p1.jpg",
      imageId: "OP01-031_p1",
    },
  ],
  effect:
    '[Activate:Main] [Once Per Turn] You can trash 1 "Land of Wano" type card from your hand: Set up to 2 of your DON!! cards as active.',
  i18n: op01KouzukiOden031I18n,
};
