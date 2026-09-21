import { describe } from "vitest";

import { theMajesticSpirit } from "../../FTC/allies/the-majestic-spirit.ts";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { arielArchangelOfNatura } from "./ariel-archangel-of-natura.ts";

/** @covers FQKVzsMp3B-a1 */
describe("Ariel, Archangel of Natura — Imbue keyword", () => {
  proveImbueKeyword({
    card: arielArchangelOfNatura,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
    donor: theMajesticSpirit,
  });
});
