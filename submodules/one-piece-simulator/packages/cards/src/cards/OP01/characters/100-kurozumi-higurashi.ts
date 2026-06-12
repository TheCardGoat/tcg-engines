import type { CharacterCard } from "@tcg/op-types";
import { op01KurozumiHigurashi100I18n } from "./100-kurozumi-higurashi.i18n.ts";

export const op01KurozumiHigurashi100: CharacterCard = {
  id: "OP01-100",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Land of Wano Kurozumi Clan"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op01KurozumiHigurashi100I18n,
};
