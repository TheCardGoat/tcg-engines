import type { CharacterCard } from "@tcg/op-types";
import { op12RoronoaZoro036I18n } from "./036-roronoa-zoro.i18n.ts";

export const op12RoronoaZoro036: CharacterCard = {
  id: "OP12-036",
  canonicalId: "OP12-036",
  slug: "roronoa-zoro/op12-036",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "OP12-036",
      artId: "OP12-036",
      setCode: "OP12",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-036_FQbcB9q.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect:
    "This card in your hand cannot be played by effects.\nIf your Leader has the (Slash) attribute, this Character cannot be K.O.'d in battle by (Slash) attribute cards and gains +1000 power.",
  i18n: op12RoronoaZoro036I18n,
};
