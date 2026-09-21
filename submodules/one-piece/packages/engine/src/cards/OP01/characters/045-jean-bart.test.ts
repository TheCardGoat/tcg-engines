import { describe, test } from "vite-plus/test";
import { op01JeanBart045 } from "../../../../../cards/src/cards/characters/op01-045-jean-bart.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-045 Jean Bart", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01JeanBart045);
  });
});
