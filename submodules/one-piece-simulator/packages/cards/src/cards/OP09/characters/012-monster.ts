import type { CharacterCard } from "@tcg/op-types";
import { op09Monster012I18n } from "./012-monster.i18n.ts";

export const op09Monster012: CharacterCard = {
  id: "OP09-012",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP09",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Animal Red-Haired Pirates"],
  attribute: "strike",
  effect:
    "If your Character [Bonk Punch] would be K.O.'d by an effect, you may trash this Character instead.",
  i18n: op09Monster012I18n,
};
