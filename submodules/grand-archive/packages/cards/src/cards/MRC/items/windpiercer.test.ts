import { describe } from "vitest";
import { windpiercer } from "./windpiercer.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers hreqhj1trn-a2 */
describe("windpiercer — load into an unloaded Gun", () => {
  proveLoadBullet({ card: windpiercer, abilityId: "hreqhj1trn-a2", reserveCost: 0 });
});
