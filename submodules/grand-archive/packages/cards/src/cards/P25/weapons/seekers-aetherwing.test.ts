import { describe } from "vitest";
import { seekersAetherwing } from "./seekers-aetherwing.ts";

import { proveClassSpellshroudObject } from "../../../testing/class-spellshroud-object.ts";
/** @covers bf7yzaqes4-a2 */
describe("seekersAetherwing Class Bonus Spellshroud", () =>
  proveClassSpellshroudObject(seekersAetherwing));

import { proveClassTrueSight } from "../../../testing/class-true-sight.ts";
/** @covers bf7yzaqes4-a3 */
describe("seekersAetherwing Class Bonus True Sight", () => proveClassTrueSight(seekersAetherwing));
