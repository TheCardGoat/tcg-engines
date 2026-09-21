import type { CharacterCard } from "@tcg/op-types";
import { printing, strawHat } from "../st01-helpers.ts";
import { st01NicoRobin008I18n } from "./st01-008-nico-robin.i18n.ts";

export const st01NicoRobin008: CharacterCard = {
  id: "ST01-008",
  canonicalId: "ST01-008",
  slug: "nico-robin/st01-008",
  name: "Nico Robin",
  printings: [printing("ST01-008", "C")],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "ST01",
  cost: 3,
  power: 5000,
  counter: 1000,
  traits: strawHat,
  attribute: "wisdom",
  i18n: st01NicoRobin008I18n,
};
