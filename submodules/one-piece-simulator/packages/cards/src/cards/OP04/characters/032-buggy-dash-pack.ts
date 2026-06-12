import type { CharacterCard } from "@tcg/op-types";
import { op04BuggyDashPack032I18n } from "./032-buggy-dash-pack.i18n.ts";

export const op04BuggyDashPack032: CharacterCard = {
  id: "OP03-032",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 5000,
  traits: ["Buggy Pirates East Blue"],
  attribute: "slash",
  effect: 'This Character cannot be K.O.\'d in battle by "Slash" attribute cards.',
  i18n: op04BuggyDashPack032I18n,
};
