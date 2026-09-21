import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { moontideIllusionist } from "./moontide-illusionist.ts";

/** @covers flzvpkc0ni-a1 */
describe("Moontide Illusionist — Imbue keyword", () => {
  proveImbueKeyword({
    card: moontideIllusionist,
    cost: { kind: "reserve", amount: 2 },
    threshold: 2,
    requirement: "source-elements",
  });
});
