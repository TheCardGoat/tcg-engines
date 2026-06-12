import type { CharacterCard } from "@tcg/op-types";
import { prb02CatarinaDevonPirateFoil084I18n } from "./084-catarina-devon-pirate-foil.i18n.ts";

export const prb02CatarinaDevonPirateFoil084: CharacterCard = {
  id: "OP09-084",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-084_r1.jpg",
      imageId: "OP09-084",
    },
  ],
  effect:
    '[Activate: Main] [Once Per Turn] If your Leader has the "Blackbeard Pirates" type, this Character gains [Double Attack], [Banish] or [Blocker] until the end of your opponent\'s next turn.',
  effects: {
    keywords: ["banish", "blocker"],
  },
  i18n: prb02CatarinaDevonPirateFoil084I18n,
};
