import { describe } from "vitest";
import { formidableYouxia } from "./formidable-youxia.ts";
import { proveCurrentDirectionStats } from "../../../testing/current-direction-stats.ts";
/** @covers acmde97dbu-a2 */
describe("formidableYouxia — direction stats", () => {
  proveCurrentDirectionStats(formidableYouxia, true);
});
