import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { hectorPraetorianGuard } from "./hector-praetorian-guard.ts";

/** @covers AsDKTmP3kp-a1 */
describe("Hector, Praetorian Guard — Imbue keyword", () => {
  proveImbueKeyword({
    card: hectorPraetorianGuard,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
