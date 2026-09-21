import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { squallbindPounce } from "./squallbind-pounce.ts";

/** @covers ep3ajxiyd3-a1 */
describe("Squallbind Pounce — Imbue keyword", () => {
  proveImbueKeyword({
    card: squallbindPounce,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
