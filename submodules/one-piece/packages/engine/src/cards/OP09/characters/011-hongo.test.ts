import { describe, test } from "vite-plus/test";
import { op09Hongo011 } from "../../../../../cards/src/cards/characters/op09-011-hongo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-011 Hongo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Hongo011);
  });
});
