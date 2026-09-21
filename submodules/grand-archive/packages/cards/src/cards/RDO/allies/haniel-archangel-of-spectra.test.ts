import { describe } from "vitest";

import { illuminateSecrets } from "../../FTC/actions/illuminate-secrets.ts";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { hanielArchangelOfSpectra } from "./haniel-archangel-of-spectra.ts";

/** @covers suH40WW60W-a1 */
describe("Haniel, Archangel of Spectra — Imbue keyword", () => {
  proveImbueKeyword({
    card: hanielArchangelOfSpectra,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
    donor: illuminateSecrets,
  });
});
