import { describe, test } from "vite-plus/test";
import { op02JudgmentOfHell089 } from "../../../../../cards/src/cards/OP02/events/089-judgment-of-hell.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-089 Judgment of Hell", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02JudgmentOfHell089);
  });
});
