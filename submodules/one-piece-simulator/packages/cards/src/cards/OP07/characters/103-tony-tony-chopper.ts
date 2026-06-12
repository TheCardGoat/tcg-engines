import type { CharacterCard } from "@tcg/op-types";
import { op07TonyTonyChopper103I18n } from "./103-tony-tony-chopper.i18n.ts";

export const op07TonyTonyChopper103: CharacterCard = {
  id: "OP07-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger:
    "Up to 1 of your {Egghead} type Characters gains [Blocker] during this turn. Then, add this card to your hand.",
  traits: ["Animal Straw Hat Crew Egghead"],
  attribute: "wisdom",
  effect:
    "[Trigger] Up to 1 of your {Egghead} type Characters gains [Blocker] during this turn. Then, add this card to your hand.",
  i18n: op07TonyTonyChopper103I18n,
};
