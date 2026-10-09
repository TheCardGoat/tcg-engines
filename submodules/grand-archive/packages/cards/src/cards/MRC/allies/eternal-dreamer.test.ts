import { describe } from "vitest";
import { eternalDreamer } from "./eternal-dreamer.ts";
import { proveClassAttackGlimpse } from "../../../testing/class-attack-glimpse.ts";
/** @covers 4kj3q2svdv-a1 */
describe("eternalDreamer Class Bonus attack Glimpse", () =>
  proveClassAttackGlimpse(eternalDreamer, "ally"));
