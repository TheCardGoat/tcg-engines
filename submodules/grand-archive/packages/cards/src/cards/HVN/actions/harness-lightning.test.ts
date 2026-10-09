import { describe } from "vitest";
import { harnessLightning } from "./harness-lightning.ts";
import { proveShenjuElementPermission } from "../../../testing/shenju-element-permission.ts";
/** @covers bzwj7ztr78-a1 */
describe("harnessLightning — arcane Shenju element permission", () => {
  proveShenjuElementPermission(harnessLightning);
});
