import { peacefulTimbre, simultaneousFireTrowaBarton, } from "./commands/commands";
import { heeroYuy } from "./pilots/pilots";
import { maganacWMS03, wingGundamBirdModeST02002, wingGundamST02001, } from "./units/unitis";
export const allCardsST02Cards = [
    peacefulTimbre,
    heeroYuy,
    simultaneousFireTrowaBarton,
    wingGundamST02001,
    wingGundamBirdModeST02002,
    maganacWMS03,
];
export const allCardsST02CardsById = {};
allCardsST02Cards.forEach((card) => {
    allCardsST02CardsById[card.id] = card;
});
//# sourceMappingURL=index.js.map