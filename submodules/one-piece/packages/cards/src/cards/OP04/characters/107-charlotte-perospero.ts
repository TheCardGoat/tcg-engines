import type { CharacterCard } from "@tcg/op-types";
import { op04CharlottePerospero107I18n } from "./107-charlotte-perospero.i18n.ts";

export const op04CharlottePerospero107: CharacterCard = {
  id: "OP04-107",
  canonicalId: "OP04-107",
  slug: "charlotte-perospero/op04-107",
  name: "Charlotte Perospero",
  printings: [
    {
      id: "OP04-107",
      artId: "OP04-107",
      setCode: "OP04",
      collectorNumber: "107",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP04-107.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP04",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect: "NULL",
  i18n: op04CharlottePerospero107I18n,
};
