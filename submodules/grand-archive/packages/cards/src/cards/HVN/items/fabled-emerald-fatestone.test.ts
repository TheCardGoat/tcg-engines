import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { fabledEmeraldFatestone } from "./fabled-emerald-fatestone.ts";

/** @covers jz7odeqku4-a1 */
describe("Fabled Emerald Fatestone — printed keywords (jz7odeqku4-a1)", () => {
  proveKeywordGroup({
    card: fabledEmeraldFatestone,
    keywords: [{ name: "immortality" }, { name: "spellshroud" }],
  });
});
