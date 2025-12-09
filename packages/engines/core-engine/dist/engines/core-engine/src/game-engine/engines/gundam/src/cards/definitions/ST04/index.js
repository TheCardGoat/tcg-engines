import { archangel } from "./bases/bases";
import { hawkOfEndymion } from "./commands/commands";
import { aileStrikeGundam, strikeDaggerGAT1 } from "./units/units";
export const allCardsST04Cards = [
    archangel,
    hawkOfEndymion,
    aileStrikeGundam,
    strikeDaggerGAT1,
];
export const allCardsST04CardsById = {};
for (const card of allCardsST04Cards) {
    allCardsST04CardsById[card.id] = card;
}
//# sourceMappingURL=index.js.map