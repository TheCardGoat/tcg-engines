import type { CharacterCard } from "@tcg/op-types";
import { op12Vergo064I18n } from "./064-vergo.i18n.ts";

export const op12Vergo064: CharacterCard = {
  id: "OP12-064",
  canonicalId: "OP12-064",
  slug: "vergo/op12-064",
  name: "Vergo",
  printings: [
    {
      id: "OP12-064",
      artId: "OP12-064",
      setCode: "OP12",
      collectorNumber: "064",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-064_a4aJQ6d.jpg",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP12",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy Punk Hazard"],
  attribute: "strike",
  i18n: op12Vergo064I18n,
};
