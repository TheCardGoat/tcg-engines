import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { fabledRubyFatestone } from "./fabled-ruby-fatestone.ts";

/** @covers mzf5dmpqbc-a1 */
describe("Fabled Ruby Fatestone — printed keywords", () => {
  proveKeywordGroup({
    card: fabledRubyFatestone,
    keywords: [
      {
        name: "immortality",
      },
      {
        name: "spellshroud",
      },
    ],
  });
});

import { proveFatestoneTransformPayment } from "../../../testing/fatestone-transform.ts";
/** @covers mzf5dmpqbc-a4 */
describe("fabledRubyFatestone transform payment", () =>
  proveFatestoneTransformPayment(fabledRubyFatestone, 7));
