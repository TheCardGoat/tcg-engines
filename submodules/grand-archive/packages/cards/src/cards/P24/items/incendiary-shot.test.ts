import { describe } from "vitest";
import { incendiaryShot } from "./incendiary-shot.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers 3qu7d6sopo-a1 */
describe("incendiaryShot — load into an unloaded Gun", () => {
  proveLoadBullet({ card: incendiaryShot, abilityId: "3qu7d6sopo-a1", reserveCost: 0 });
});
