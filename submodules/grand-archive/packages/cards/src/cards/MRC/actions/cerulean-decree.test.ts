import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { ceruleanDecree } from "./cerulean-decree.ts";

/** @covers ipl6gt7lh9-a1 */
describe("Cerulean Decree — Imbue keyword", () => {
  proveImbueKeyword({
    card: ceruleanDecree,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});
