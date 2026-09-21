import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { nurielSeraphicPaladin } from "./nuriel-seraphic-paladin.ts";

/** @covers b9lli2PE7I-a1 */
describe("Nuriel, Seraphic Paladin — Imbue keyword", () => {
  proveImbueKeyword({
    card: nurielSeraphicPaladin,
    cost: { kind: "reserve", amount: 4 },
    threshold: 3,
    requirement: "advanced",
  });
});
