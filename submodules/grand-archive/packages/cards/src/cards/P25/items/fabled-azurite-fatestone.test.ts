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
