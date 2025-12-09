import { aShowOfResolve, kaisResolveKaiShiden } from "./commands/commands";
import { amuroRay, sulettaMercury } from "./pilots/pilots";
import { demiTrainer, gmRgm79, gundamAerialBitOnFormXVX016, gundamRx782, } from "./units/units";
export const allCardsST01Cards = [
    aShowOfResolve,
    kaisResolveKaiShiden,
    amuroRay,
    sulettaMercury,
    gundamRx782,
    demiTrainer,
    gundamAerialBitOnFormXVX016,
    gmRgm79,
];
export const allCardsST01CardsById = {};
allCardsST01Cards.forEach((card) => {
    allCardsST01CardsById[card.id] = card;
});
//# sourceMappingURL=index.js.map