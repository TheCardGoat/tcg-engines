import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { shangxiangFiercePrincess } from "./shangxiang-fierce-princess.ts";

/** @covers s2tzwv1uw3-a1 */
describe("Shangxiang, Fierce Princess — Imbue keyword", () => {
  proveImbueKeyword({
    card: shangxiangFiercePrincess,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
