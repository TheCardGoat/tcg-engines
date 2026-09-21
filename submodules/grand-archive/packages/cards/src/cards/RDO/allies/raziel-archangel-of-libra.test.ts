import { describe } from "vitest";

import { voltaicSphere } from "../../FTC/actions/voltaic-sphere.ts";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { razielArchangelOfLibra } from "./raziel-archangel-of-libra.ts";

/** @covers ozpG6bt7nC-a1 */
describe("Raziel, Archangel of Libra — Imbue keyword", () => {
  proveImbueKeyword({
    card: razielArchangelOfLibra,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
    donor: voltaicSphere,
  });
});
