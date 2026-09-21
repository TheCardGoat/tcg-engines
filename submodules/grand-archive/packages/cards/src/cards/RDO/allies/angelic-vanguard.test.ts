import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { angelicVanguard } from "./angelic-vanguard.ts";

/** @covers aKjX6INGkV-a1 */
describe("Angelic Vanguard — Imbue keyword", () => {
  proveImbueKeyword({
    card: angelicVanguard,
    cost: { kind: "reserve", amount: 3 },
    threshold: 2,
    requirement: "advanced",
  });
});
