import type { CharacterCard } from "@tcg/op-types";
import { op06Genbo105I18n } from "./105-genbo.i18n.ts";

export const op06Genbo105: CharacterCard = {
  id: "OP06-105",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP06",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Sky Island Shandian Warrior"],
  attribute: "ranged",
  i18n: op06Genbo105I18n,
};
