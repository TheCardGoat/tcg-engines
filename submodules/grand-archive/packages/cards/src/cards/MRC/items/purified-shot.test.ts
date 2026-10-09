import { describe } from "vitest";
import { purifiedShot } from "./purified-shot.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers dcgw05q66h-a1 */
describe("purifiedShot — load into an unloaded Gun", () => {
  proveLoadBullet({ card: purifiedShot, abilityId: "dcgw05q66h-a1", reserveCost: 0 });
});
