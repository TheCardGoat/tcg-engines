import type { CharacterCard } from "@tcg/op-types";
import { op01JeanBart045I18n } from "./045-jean-bart.i18n.ts";

export const op01JeanBart045: CharacterCard = {
  id: "OP01-045",
  canonicalId: "OP01-045",
  slug: "jean-bart/op01-045",
  name: "Jean Bart",
  printings: [
    {
      id: "OP01-045",
      artId: "OP01-045",
      setCode: "OP01",
      collectorNumber: "045",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-045.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "strike",
  effect: "NULL",
  i18n: op01JeanBart045I18n,
};
