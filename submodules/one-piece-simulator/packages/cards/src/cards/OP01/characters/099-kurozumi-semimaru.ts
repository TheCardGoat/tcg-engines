import type { CharacterCard } from "@tcg/op-types";
import { op01KurozumiSemimaru099I18n } from "./099-kurozumi-semimaru.i18n.ts";

export const op01KurozumiSemimaru099: CharacterCard = {
  id: "OP01-099",
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
    "Kurozumi Clan type Characters other than your [Kurozumi Semimaru] cannot be K.O.'d in battle.",
  i18n: op01KurozumiSemimaru099I18n,
};
