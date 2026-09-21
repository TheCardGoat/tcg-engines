import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { benedictionAngel } from "./benediction-angel.ts";

/** @covers kl4bTg57Cj-a1 */
describe("Benediction Angel — Imbue keyword", () => {
  proveImbueKeyword({
    card: benedictionAngel,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "advanced",
  });
});
