import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { fabledAzuriteFatestone } from "./fabled-azurite-fatestone.ts";

/** @covers 6ce5rzrjd9-a1 */
describe("Fabled Azurite Fatestone — printed keywords (6ce5rzrjd9-a1)", () => {
  proveKeywordGroup({
    card: fabledAzuriteFatestone,
    keywords: [{ name: "immortality" }, { name: "spellshroud" }],
  });
});

import { proveFatestoneTransform } from "../../../testing/fatestone-transform.ts";

/** @covers fcfxhkqda6-a1 */
describe("Fatestone — transformed keywords", () => {
  proveFatestoneTransform({
    card: fabledAzuriteFatestone,
    counters: 10,
    keywords: [{ name: "spellshroud" }, { name: "taunt" }],
  });
});

import { proveFatestoneTransformPayment } from "../../../testing/fatestone-transform.ts";
/** @covers 6ce5rzrjd9-a4 */
describe("fabledAzuriteFatestone transform payment", () =>
  proveFatestoneTransformPayment(fabledAzuriteFatestone, 10));
