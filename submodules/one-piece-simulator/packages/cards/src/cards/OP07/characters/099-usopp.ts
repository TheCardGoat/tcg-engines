import type { CharacterCard } from "@tcg/op-types";
import { op07Usopp099I18n } from "./099-usopp.i18n.ts";

export const op07Usopp099: CharacterCard = {
  id: "OP07-099",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 2000,
  trigger:
    "Up to 1 of your {Egghead} type Leader or Character cards gains +2000 power until the end of your next turn.",
  traits: ["Straw Hat Crew Egghead"],
  attribute: "ranged",
  effect:
    "[Trigger] Up to 1 of your {Egghead} type Leader or Character cards gains +2000 power until the end of your next turn.",
  i18n: op07Usopp099I18n,
};
