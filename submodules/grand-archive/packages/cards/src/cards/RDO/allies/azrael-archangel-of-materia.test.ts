import { describe } from "vitest";

import { wrathfulSlime } from "../../HVN/allies/wrathful-slime.ts";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { azraelArchangelOfMateria } from "./azrael-archangel-of-materia.ts";

/** @covers eDCnvWoGxf-a1 */
describe("Azrael, Archangel of Materia — Imbue keyword", () => {
  proveImbueKeyword({
    card: azraelArchangelOfMateria,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
    donor: wrathfulSlime,
  });
});
