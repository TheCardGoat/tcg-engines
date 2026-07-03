import type { CharacterCard } from "@tcg/op-types";
import { op03Gaimon043I18n } from "./043-gaimon.i18n.ts";

export const op03Gaimon043: CharacterCard = {
  id: "OP03-043",
  canonicalId: "OP03-043",
  slug: "gaimon/op03-043",
  name: "Gaimon",
  printings: [
    {
      id: "OP03-043",
      artId: "OP03-043",
      setCode: "OP03",
      collectorNumber: "043",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-043.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "wisdom",
  effect:
    "When you deal damage to your opponent's Life, you may trash 3 cards from the top of your deck. If you do, trash this Character.",
  i18n: op03Gaimon043I18n,
};
