import { describe, test } from "vite-plus/test";
import { op08Thatch045 } from "../../../../../cards/src/cards/OP08/characters/045-thatch.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-045 Thatch", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Thatch045);
  });
});
