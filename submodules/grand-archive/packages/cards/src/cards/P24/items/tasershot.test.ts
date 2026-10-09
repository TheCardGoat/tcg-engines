import { describe } from "vitest";
import { tasershot } from "./tasershot.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers 4x7e22tk3i-a2 */
describe("tasershot — load into an unloaded Gun", () => {
  proveLoadBullet({ card: tasershot, abilityId: "4x7e22tk3i-a2", reserveCost: 0 });
});
