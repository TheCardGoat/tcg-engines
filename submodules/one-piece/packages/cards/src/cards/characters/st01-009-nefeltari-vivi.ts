import type { CharacterCard } from "@tcg/op-types";
import { printing } from "../st01-helpers.ts";
import { st01NefeltariVivi009I18n } from "./st01-009-nefeltari-vivi.i18n.ts";

export const st01NefeltariVivi009: CharacterCard = {
  id: "ST01-009",
  canonicalId: "ST01-009",
  slug: "nefeltari-vivi/st01-009",
  name: "Nefeltari Vivi",
  printings: [printing("ST01-009", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 2,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  i18n: st01NefeltariVivi009I18n,
};
