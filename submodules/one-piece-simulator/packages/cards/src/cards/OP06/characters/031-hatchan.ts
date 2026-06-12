import type { CharacterCard } from "@tcg/op-types";
import { op06Hatchan031I18n } from "./031-hatchan.i18n.ts";

export const op06Hatchan031: CharacterCard = {
  id: "OP06-031",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    "Play up to 1 [Fish-Man] or [Merfolk] type Character card with a cost of 3 or less from your hand.",
  traits: ["Fish-Man Former Arlong Pirates"],
  attribute: "slash",
  effect:
    "[Trigger] Play up to 1 [Fish-Man] or [Merfolk] type Character card with a cost of 3 or less from your hand.",
  i18n: op06Hatchan031I18n,
};
