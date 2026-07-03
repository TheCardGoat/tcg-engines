import type { CharacterCard } from "@tcg/op-types";
import { op11VinsmokeNiji045I18n } from "./045-vinsmoke-niji.i18n.ts";

export const op11VinsmokeNiji045: CharacterCard = {
  id: "OP11-045",
  canonicalId: "OP11-045",
  slug: "vinsmoke-niji/op11-045",
  name: "Vinsmoke Niji",
  printings: [
    {
      id: "OP11-045",
      artId: "OP11-045",
      setCode: "OP11",
      collectorNumber: "045",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-045.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  i18n: op11VinsmokeNiji045I18n,
};
