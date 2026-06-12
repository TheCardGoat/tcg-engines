import type { CharacterCard } from "@tcg/op-types";
import { eb01ArmyWolves032I18n } from "./032-army-wolves.i18n.ts";

export const eb01ArmyWolves032: CharacterCard = {
  id: "EB01-032",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "EB01",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Impel Down"],
  attribute: "strike",
  i18n: eb01ArmyWolves032I18n,
};
