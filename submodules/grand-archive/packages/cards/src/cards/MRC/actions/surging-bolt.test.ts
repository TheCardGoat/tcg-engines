import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { surgingBolt } from "./surging-bolt.ts";

/** @covers 08kkz07nau-a1 */
describe("Surging Bolt — Imbue keyword", () => {
  proveImbueKeyword({
    card: surgingBolt,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
