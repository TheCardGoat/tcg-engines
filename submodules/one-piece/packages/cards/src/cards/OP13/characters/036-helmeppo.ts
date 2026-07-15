import type { CharacterCard } from "@tcg/op-types";
import { op13Helmeppo036I18n } from "./036-helmeppo.i18n.ts";

export const op13Helmeppo036: CharacterCard = {
  id: "OP13-036",
  canonicalId: "OP13-036",
  slug: "helmeppo/op13-036",
  name: "Helmeppo",
  printings: [
    {
      id: "OP13-036",
      artId: "OP13-036",
      setCode: "OP13",
      collectorNumber: "036",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-036_5dHg4Pe.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP13",
  cost: 5,
  power: 6000,
  counter: 2000,
  traits: ["FILM Navy"],
  attribute: "slash",
  i18n: op13Helmeppo036I18n,
};
