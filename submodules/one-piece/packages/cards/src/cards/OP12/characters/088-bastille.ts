import type { CharacterCard } from "@tcg/op-types";
import { op12Bastille088I18n } from "./088-bastille.i18n.ts";

export const op12Bastille088: CharacterCard = {
  id: "OP12-088",
  canonicalId: "OP12-088",
  slug: "bastille/op12-088",
  name: "Bastille",
  printings: [
    {
      id: "OP12-088",
      artId: "OP12-088",
      setCode: "OP12",
      collectorNumber: "088",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-088_pDNsCZK.jpg",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP12",
  cost: 6,
  power: 8000,
  counter: 1000,
  traits: ["Navy Dressrosa"],
  attribute: "slash",
  i18n: op12Bastille088I18n,
};
