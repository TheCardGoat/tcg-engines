import type { CharacterCard } from "@tcg/op-types";
import { printing, strawHat } from "../st01-helpers.ts";
import { st01Franky010I18n } from "./st01-010-franky.i18n.ts";

export const st01Franky010: CharacterCard = {
  id: "ST01-010",
  canonicalId: "ST01-010",
  slug: "franky/st01-010",
  name: "Franky",
  printings: [printing("ST01-010", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 4,
  power: 6000,
  counter: 1000,
  traits: strawHat,
  attribute: "strike",
  i18n: st01Franky010I18n,
};
