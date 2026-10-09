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

import { proveFatestoneTransform } from "../../../testing/fatestone-transform.ts";

/** @covers r1sc1xaf9l-a1 */
describe("Fatestone — transformed keywords", () => {
  proveFatestoneTransform({
    card: fabledEmeraldFatestone,
    counters: 8,
    keywords: [{ name: "spellshroud" }, { name: "vigor" }],
  });
});

import { proveFatestoneTransformPayment } from "../../../testing/fatestone-transform.ts";
/** @covers jz7odeqku4-a4 */
describe("fabledEmeraldFatestone transform payment", () =>
  proveFatestoneTransformPayment(fabledEmeraldFatestone, 8));
