import { describe } from "vitest";
import { platedBullet } from "./plated-bullet.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers l75tlzsmw3-a2 */
describe("platedBullet — load into an unloaded Gun", () => {
  proveLoadBullet({ card: platedBullet, abilityId: "l75tlzsmw3-a2", reserveCost: 0 });
});
