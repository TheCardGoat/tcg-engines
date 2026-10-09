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

import { proveFatestoneTransform } from "../../../testing/fatestone-transform.ts";

/** @covers fhi78gfkli-a1 */
describe("Fatestone — transformed keywords", () => {
  proveFatestoneTransform({
    card: fabledSapphireFatestone,
    counters: 9,
    keywords: [{ name: "spellshroud" }, { name: "taunt" }],
  });
});

import { proveFatestoneTransformPayment } from "../../../testing/fatestone-transform.ts";
/** @covers vzmnt0orxj-a4 */
describe("fabledSapphireFatestone transform payment", () =>
  proveFatestoneTransformPayment(fabledSapphireFatestone, 9));
