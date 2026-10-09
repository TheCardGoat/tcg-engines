import { describe } from "vitest";
import { swordOfSeeking } from "./sword-of-seeking.ts";

import { proveClassTrueSight } from "../../../testing/class-true-sight.ts";
/** @covers Dz8I0eJzaf-a1 */
describe("swordOfSeeking Class Bonus True Sight", () => proveClassTrueSight(swordOfSeeking));
