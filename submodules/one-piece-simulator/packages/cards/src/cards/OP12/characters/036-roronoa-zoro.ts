import type { CharacterCard } from "@tcg/op-types";
import { op12RoronoaZoro036I18n } from "./036-roronoa-zoro.i18n.ts";

export const op12RoronoaZoro036: CharacterCard = {
  id: "OP12-036",
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
