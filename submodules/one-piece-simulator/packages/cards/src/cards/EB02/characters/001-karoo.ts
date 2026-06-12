import type { CharacterCard } from "@tcg/op-types";
import { eb02Karoo001I18n } from "./001-karoo.i18n.ts";

export const eb02Karoo001: CharacterCard = {
  id: "EB02-001",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "EB02",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Alabasta"],
  attribute: "strike",
  i18n: eb02Karoo001I18n,
};
