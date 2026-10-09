import { describe } from "vitest";
import { seiryuusCommand } from "./seiryuus-command.ts";
import { proveShenjuElementPermission } from "../../../testing/shenju-element-permission.ts";
/** @covers v9d2242357-a1 */
describe("seiryuusCommand — arcane Shenju element permission", () => {
  proveShenjuElementPermission(seiryuusCommand);
});
