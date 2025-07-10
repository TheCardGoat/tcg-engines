import type { GundamitoCard } from "../cardTypes";
import { gearaZuluAMS129, sinanjuMSN065, zakuIIMS06 } from "./units/units";

export const allCardsST03Cards = [sinanjuMSN065, zakuIIMS06, gearaZuluAMS129];
export const allCardsST03CardsById: Record<string, GundamitoCard> = {};

for (const card of allCardsST03Cards) {
  allCardsST03CardsById[card.id] = card;
}
