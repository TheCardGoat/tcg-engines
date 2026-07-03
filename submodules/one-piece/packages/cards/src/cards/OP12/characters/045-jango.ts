import type { CharacterCard } from "@tcg/op-types";
import { op12Jango045I18n } from "./045-jango.i18n.ts";

export const op12Jango045: CharacterCard = {
  id: "OP12-045",
  canonicalId: "OP12-045",
  slug: "jango/op12-045",
  name: "Jango",
  printings: [
    {
      id: "OP12-045",
      artId: "OP12-045",
      setCode: "OP12",
      collectorNumber: "045",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-045_d7p2Fvs.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP12",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  i18n: op12Jango045I18n,
};
