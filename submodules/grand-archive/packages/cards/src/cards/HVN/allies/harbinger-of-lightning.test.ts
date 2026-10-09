import { describe } from "vitest";
import { harbingerOfLightning } from "./harbinger-of-lightning.ts";
import { proveShenjuElementPermission } from "../../../testing/shenju-element-permission.ts";
/** @covers 1i5z6r7s9k-a1 */
describe("harbingerOfLightning — arcane Shenju element permission", () => {
  proveShenjuElementPermission(harbingerOfLightning);
});
