import type { StageCard } from "@tcg/op-types";
import { op04CorridaColiseum096I18n } from "./096-corrida-coliseum.i18n.ts";

export const op04CorridaColiseum096: StageCard = {
  id: "OP04-096",
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP04",
  cost: 1,
  traits: ["Dressrosa"],
  effect:
    "If your Leader has the [Dressrosa] type, your [Dressrosa] type Characters can attack Characters on the turn in which they are played.",
  i18n: op04CorridaColiseum096I18n,
};
