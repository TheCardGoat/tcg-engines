import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { eternalMagistrate } from "./eternal-magistrate.ts";

/** @covers taug52u81v-a1 */
describe("Eternal Magistrate — Imbue keyword", () => {
  proveImbueKeyword({
    card: eternalMagistrate,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
