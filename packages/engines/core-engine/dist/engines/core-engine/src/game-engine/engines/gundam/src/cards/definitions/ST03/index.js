import { gearaZuluAMS129, sinanjuMSN065, zakuIIMS06 } from "./units/units";
export const allCardsST03Cards = [sinanjuMSN065, zakuIIMS06, gearaZuluAMS129];
export const allCardsST03CardsById = {};
for (const card of allCardsST03Cards) {
    allCardsST03CardsById[card.id] = card;
}
//# sourceMappingURL=index.js.map