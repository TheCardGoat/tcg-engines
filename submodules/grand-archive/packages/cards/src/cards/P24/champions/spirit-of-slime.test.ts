import { describe } from "vitest";

import { proveStartingChampionDraw } from "../../../testing/starting-champion-draw.ts";
import { spiritOfSlime } from "./spirit-of-slime.ts";

/** @covers 0xp4xq07vv-a1 */
describe("Spirit of Slime — starting champion entry draw", () => {
  proveStartingChampionDraw({ card: spiritOfSlime });
});

import { proveSubtypeElementPermission } from "../../../testing/subtype-element-permission.ts";
import { redSlime } from "../../FTC/allies/red-slime.ts";
import { blueSlime } from "../../DOA/allies/blue-slime.ts";
import { greenSlime } from "../../FTC/allies/green-slime.ts";
import { vampiricSlime } from "../../MRC/allies/vampiric-slime.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { windriderMage } from "../../DOA/allies/windrider-mage.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers 0xp4xq07vv-a2 */
describe("spiritOfSlime inherited element permission", () => {
  proveSubtypeElementPermission(spiritOfSlime, [
    [redSlime, true],
    [blueSlime, true],
    [greenSlime, true],
    [vampiricSlime, false],
    [blitzMage, false],
    [giantTortoise, false],
    [windriderMage, false],
    [woodlandSquirrels, false],
  ]);
});

import { proveInheritedElementTransition } from "../../../testing/subtype-element-permission.ts";
describe("spiritOfSlime level transitions", () => {
  proveInheritedElementTransition(spiritOfSlime, greenSlime);
});
