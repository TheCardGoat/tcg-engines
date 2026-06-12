import type { CharacterCard } from "@tcg/op-types";
import { op11BlackMaria089I18n } from "./089-black-maria.i18n.ts";

export const op11BlackMaria089: CharacterCard = {
  id: "OP11-089",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 7000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "special",
  i18n: op11BlackMaria089I18n,
};
