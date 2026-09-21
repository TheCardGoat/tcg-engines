import { describe, test } from "vite-plus/test";
import { op08Ginrummy086 } from "../../../../../cards/src/cards/characters/op08-086-ginrummy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-086 Ginrummy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Ginrummy086);
  });
});
