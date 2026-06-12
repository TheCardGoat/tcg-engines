import type { CharacterCard } from "@tcg/op-types";
import { op13Wapol018I18n } from "./018-wapol.i18n.ts";

export const op13Wapol018: CharacterCard = {
  id: "OP13-018",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP13",
  cost: 6,
  power: 7000,
  counter: 2000,
  traits: ["Evil Black Drum Kingdom"],
  attribute: "strike",
  i18n: op13Wapol018I18n,
};
