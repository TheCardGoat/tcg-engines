import { describe, test } from "vite-plus/test";
import { op01Kawamatsu037 } from "../../../../../cards/src/cards/characters/op01-037-kawamatsu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-037 Kawamatsu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kawamatsu037);
  });
});
