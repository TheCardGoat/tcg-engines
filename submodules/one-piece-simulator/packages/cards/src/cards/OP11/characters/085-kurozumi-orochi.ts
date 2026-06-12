import type { CharacterCard } from "@tcg/op-types";
import { op11KurozumiOrochi085I18n } from "./085-kurozumi-orochi.i18n.ts";

export const op11KurozumiOrochi085: CharacterCard = {
  id: "OP11-085",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP11",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "wisdom",
  effect:
    '[On Play] Add up to 1 "SMILE" type card with a cost of 5 or less from your trash to your hand.',
  i18n: op11KurozumiOrochi085I18n,
};
