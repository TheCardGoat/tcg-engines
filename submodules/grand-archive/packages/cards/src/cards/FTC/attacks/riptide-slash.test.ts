import { describe } from "vitest";
import { riptideSlash } from "./riptide-slash.ts";
import { proveClassAttackGlimpse } from "../../../testing/class-attack-glimpse.ts";
/** @covers 1tzgcxyky2-a1 */
describe("riptideSlash Class Bonus attack Glimpse", () =>
  proveClassAttackGlimpse(riptideSlash, "attack"));
