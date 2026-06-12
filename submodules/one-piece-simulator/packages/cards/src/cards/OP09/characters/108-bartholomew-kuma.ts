import type { CharacterCard } from "@tcg/op-types";
import { op09BartholomewKuma108I18n } from "./108-bartholomew-kuma.i18n.ts";

export const op09BartholomewKuma108: CharacterCard = {
  id: "OP09-108",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP09",
  cost: 4,
  power: 5000,
  counter: 2000,
  trigger:
    'If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  traits: ["Revolutionary Army The Seven Warlords of the Sea"],
  attribute: "strike",
  effect:
    '[Trigger] If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  i18n: op09BartholomewKuma108I18n,
};
