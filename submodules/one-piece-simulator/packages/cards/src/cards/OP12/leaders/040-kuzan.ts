import type { LeaderCard } from "@tcg/op-types";
import { op12Kuzan040I18n } from "./040-kuzan.i18n.ts";

export const op12Kuzan040: LeaderCard = {
  id: "OP12-040",
  cardType: "leader",
  color: ["blue"],
  rarity: "L",
  setId: "OP12",
  power: 5000,
  life: 5,
  traits: ["Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-040_p1_IOHOSfT.jpg",
      imageId: "OP12-040_p1",
    },
  ],
  effect:
    'When a card is trashed from your hand by your "Navy" type card\'s effect, draw cards equal to the number of cards trashed.',
  i18n: op12Kuzan040I18n,
};
