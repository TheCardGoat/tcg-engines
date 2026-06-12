import type { CharacterCard } from "@tcg/op-types";
import { op07RoronoaZoro113I18n } from "./113-roronoa-zoro.i18n.ts";

export const op07RoronoaZoro113: CharacterCard = {
  id: "OP07-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    "If your Leader has the [Egghead] type, rest up to 1 of your opponent's Leader or Character cards.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "slash",
  effect:
    "[Trigger] If your Leader has the [Egghead] type, rest up to 1 of your opponent's Leader or Character cards.",
  i18n: op07RoronoaZoro113I18n,
};
