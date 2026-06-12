import type { CharacterCard } from "@tcg/op-types";
import { op09CatarinaDevon084I18n } from "./084-catarina-devon.i18n.ts";

export const op09CatarinaDevon084: CharacterCard = {
  id: "OP09-084",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Blackbeard Pirates"],
  attribute: "special",
  effect:
    '[Activate: Main] [Once Per Turn] If your Leader has the "Blackbeard Pirates" type, this Character gains [Double Attack], [Banish] or [Blocker] until the end of your opponent\'s next turn.',
  effects: {
    keywords: ["banish", "blocker"],
  },
  i18n: op09CatarinaDevon084I18n,
};
