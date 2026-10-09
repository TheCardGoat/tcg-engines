import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { spiritOfChess } from "./spirit-of-chess.ts";

/** @covers AYe0neu31W-a1 */
describe("Spirit of Chess — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: spiritOfChess });
});

import { proveSubtypeElementPermission } from "../../../testing/subtype-element-permission.ts";
import { briarSchwartzKing } from "../../DTR/allies/briar-schwartz-king.ts";
import { weissBishop } from "../../PTM/allies/weiss-bishop.ts";
import { goldenRook } from "../../PTM/allies/golden-rook.ts";
import { spirelleSchwartzQueen } from "../../DTR/allies/spirelle-schwartz-queen.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { windriderMage } from "../../DOA/allies/windrider-mage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers AYe0neu31W-a2 */
describe("spiritOfChess inherited element permission", () => {
  proveSubtypeElementPermission(spiritOfChess, [
    [briarSchwartzKing, true],
    [weissBishop, true],
    [goldenRook, true],
    [spirelleSchwartzQueen, false],
    [blitzMage, false],
    [giantTortoise, false],
    [windriderMage, false],
    [woodlandSquirrels, false],
  ]);
});

import { proveInheritedElementTransition } from "../../../testing/subtype-element-permission.ts";
describe("spiritOfChess level transitions", () => {
  proveInheritedElementTransition(spiritOfChess, briarSchwartzKing);
});
