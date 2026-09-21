import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { captainArcher } from "./captain-archer.ts";

/** @covers disqw3d0o5-a1 */
describe("Captain Archer — Imbue keyword", () => {
  proveImbueKeyword({
    card: captainArcher,
    cost: { kind: "reserve", amount: 4 },
    threshold: 4,
    requirement: "source-elements",
  });
});
