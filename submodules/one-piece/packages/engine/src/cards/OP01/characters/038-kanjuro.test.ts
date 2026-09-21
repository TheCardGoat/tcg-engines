import { describe, test } from "vite-plus/test";
import { op01Kanjuro038 } from "../../../../../cards/src/cards/characters/op01-038-kanjuro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-038 Kanjuro", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Kanjuro038);
  });
});
