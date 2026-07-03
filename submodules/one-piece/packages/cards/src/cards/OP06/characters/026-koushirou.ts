import type { CharacterCard } from "@tcg/op-types";
import { op06Koushirou026I18n } from "./026-koushirou.i18n.ts";

export const op06Koushirou026: CharacterCard = {
  id: "OP06-026",
  canonicalId: "OP06-026",
  slug: "koushirou/op06-026",
  name: "Koushirou",
  printings: [
    {
      id: "OP06-026",
      artId: "OP06-026",
      setCode: "OP06",
      collectorNumber: "026",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-026.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 0,
  counter: 1000,
  traits: ["Frost Moon Village"],
  attribute: "slash",
  effect:
    '[On Play] Set up to 1 of your "Slash" attribute Characters with a cost of 4 or less as active. Then, you cannot attack a Leader during this turn.',
  i18n: op06Koushirou026I18n,
};
