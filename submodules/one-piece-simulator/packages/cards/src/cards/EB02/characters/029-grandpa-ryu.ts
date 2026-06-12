import type { CharacterCard } from "@tcg/op-types";
import { eb02GrandpaRyu029I18n } from "./029-grandpa-ryu.i18n.ts";

export const eb02GrandpaRyu029: CharacterCard = {
  id: "EB02-029",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB02",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: ["Animal East Blue"],
  attribute: "wisdom",
  i18n: eb02GrandpaRyu029I18n,
};
