import { describe } from "vitest";
import { steelSlug } from "./steel-slug.ts";
import { proveLoadBullet } from "../../../testing/load-bullet.ts";
/** @covers ao8bki6fxx-a2 */
describe("steelSlug — load into an unloaded Gun", () => {
  proveLoadBullet({ card: steelSlug, abilityId: "ao8bki6fxx-a2", reserveCost: 0 });
});
