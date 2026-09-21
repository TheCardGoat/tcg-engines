import { describe, test } from "vite-plus/test";
import { op01Shinobu043 } from "../../../../../cards/src/cards/characters/op01-043-shinobu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-043 Shinobu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Shinobu043);
  });
});
