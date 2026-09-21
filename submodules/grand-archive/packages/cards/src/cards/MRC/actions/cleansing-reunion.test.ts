import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { cleansingReunion } from "./cleansing-reunion.ts";

/** @covers xpnjvt9y59-a1 */
describe("Cleansing Reunion — Imbue keyword", () => {
  proveImbueKeyword({
    card: cleansingReunion,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
