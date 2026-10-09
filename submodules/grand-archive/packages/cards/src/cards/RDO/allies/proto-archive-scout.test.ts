import { describe } from "vitest";
import { protoArchiveScout } from "./proto-archive-scout.ts";

import { proveStateStealth } from "../../../testing/state-stealth.ts";
/** @covers kYJUmd11o1-a1 */
describe("proto-archive-scout — conditional Stealth", () => {
  proveStateStealth(protoArchiveScout, "awake");
});
