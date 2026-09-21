import type { CharacterCard } from "@tcg/op-types";
import { printing } from "../st01-helpers.ts";
import { st01Karoo003I18n } from "./st01-003-karoo.i18n.ts";

export const st01Karoo003: CharacterCard = {
  id: "ST01-003",
  canonicalId: "ST01-003",
  slug: "karoo/st01-003",
  name: "Karoo",
  printings: [printing("ST01-003", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 1,
  power: 3000,
  counter: 1000,
  traits: ["Animal", "Alabasta"],
  attribute: "strike",
  i18n: st01Karoo003I18n,
};
