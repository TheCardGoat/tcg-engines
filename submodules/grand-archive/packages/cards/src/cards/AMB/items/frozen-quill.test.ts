import { describe } from "vitest";

import { proveLoadBow } from "../../../testing/load-bow.ts";
import { frozenQuill } from "./frozen-quill.ts";

/** @covers iqcknwa2vl-a1 */
describe("Frozen Quill — load", () => {
  proveLoadBow({ card: frozenQuill, abilityId: "iqcknwa2vl-a1" });
});
