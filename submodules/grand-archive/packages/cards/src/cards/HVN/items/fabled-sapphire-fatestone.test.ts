import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { fabledSapphireFatestone } from "./fabled-sapphire-fatestone.ts";

/** @covers vzmnt0orxj-a1 */
describe("Fabled Sapphire Fatestone — printed keywords (vzmnt0orxj-a1)", () => {
  proveKeywordGroup({
    card: fabledSapphireFatestone,
    keywords: [{ name: "immortality" }, { name: "spellshroud" }],
  });
});
