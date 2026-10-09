import { describe } from "vitest";
import { seersSword } from "./seers-sword.ts";
import { proveClassAttackGlimpse } from "../../../testing/class-attack-glimpse.ts";
/** @covers XQKyUqsMUg-a1 */
describe("seersSword Class Bonus attack Glimpse", () =>
  proveClassAttackGlimpse(seersSword, "weapon"));
